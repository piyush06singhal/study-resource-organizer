'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Loader2, FileText, Upload, X } from 'lucide-react'
import { createResource, updateResource, uploadFile } from '@/lib/actions/resources'
import { useRouter } from 'next/navigation'

interface ResourceFormProps {
  resource?: {
    id: string
    title: string
    type: string
    content?: string
    url?: string
    tags: string[]
  }
  topics?: Array<{ id: string; name: string; subjects: { name: string; color: string } | null }>
}

export function ResourceForm({ resource, topics = [] }: ResourceFormProps) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    type: resource?.type || 'note',
    content: resource?.content || '',
    url: resource?.url || '',
    tags: resource?.tags || [],
    topic_ids: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    let file_path = undefined
    let file_size = undefined

    // Upload file if present
    if (file && (formData.type === 'pdf' || formData.type === 'image')) {
      setIsUploading(true)
      const uploadResult = await uploadFile(file)
      setIsUploading(false)

      if (uploadResult.error) {
        setError(uploadResult.error)
        setIsSubmitting(false)
        return
      }

      file_path = uploadResult.file_path
      file_size = uploadResult.file_size
    }

    const result = resource
      ? await updateResource(resource.id, formData)
      : await createResource({ ...formData, file_path, file_size })

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/resources')
      router.refresh()
    }
  }

  function addTag() {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            {resource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {resource ? 'Update your resource details' : 'Add a new study resource to your library'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Operating Systems Lecture Notes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="h-12"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Resource Type *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="note">📝 Note</option>
              <option value="pdf">📄 PDF Document</option>
              <option value="image">🖼️ Image</option>
              <option value="link">🔗 Link</option>
              <option value="video">🎥 Video</option>
            </select>
          </div>

          {/* File Upload for PDF/Image */}
          {(formData.type === 'pdf' || formData.type === 'image') && !resource && (
            <div className="space-y-2">
              <Label htmlFor="file">Upload File *</Label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  id="file"
                  type="file"
                  accept={formData.type === 'pdf' ? '.pdf' : 'image/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required={!resource}
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  {file ? (
                    <p className="text-sm font-medium">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.type === 'pdf' ? 'PDF files only' : 'PNG, JPG, GIF up to 10MB'}
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* URL for Links/Videos */}
          {(formData.type === 'link' || formData.type === 'video') && (
            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="h-12"
              />
            </div>
          )}

          {/* Content/Notes */}
          <div className="space-y-2">
            <Label htmlFor="content">
              {formData.type === 'note' ? 'Content *' : 'Description'}
            </Label>
            <textarea
              id="content"
              placeholder={formData.type === 'note' ? 'Write your notes here...' : 'Brief description...'}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required={formData.type === 'note'}
              rows={8}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="h-10"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary/70"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Topics */}
          {topics.length > 0 && (
            <div className="space-y-2">
              <Label>Link to Topics (Optional)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {topics.map((topic) => (
                  <label
                    key={topic.id}
                    className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={topic.id}
                      onChange={(e) => {
                        const topicId = e.target.value
                        setFormData({
                          ...formData,
                          topic_ids: e.target.checked
                            ? [...formData.topic_ids, topicId]
                            : formData.topic_ids.filter((id: string) => id !== topicId)
                        })
                      }}
                      className="rounded"
                    />
                    <span className="text-sm truncate">{topic.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 h-12"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Uploading...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {resource ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                resource ? 'Update Resource' : 'Create Resource'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="h-12"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

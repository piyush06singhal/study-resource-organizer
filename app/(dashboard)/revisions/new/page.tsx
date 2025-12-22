'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { createRevision } from '@/lib/actions/revisions'
import { getTopics } from '@/lib/actions/topics'

export default function NewRevisionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicParam = searchParams.get('topic')

  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    topic_id: topicParam || '',
    revision_date: new Date().toISOString().split('T')[0],
    confidence_level: '3',
    notes: '',
    next_revision_date: ''
  })

  useEffect(() => {
    async function loadTopics() {
      const data = await getTopics()
      setTopics(data)
    }
    loadTopics()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createRevision({
        topic_id: formData.topic_id,
        revision_date: new Date(formData.revision_date).toISOString(),
        confidence_level: parseInt(formData.confidence_level),
        notes: formData.notes || undefined,
        next_revision_date: formData.next_revision_date 
          ? new Date(formData.next_revision_date).toISOString()
          : undefined
      })

      if (result.error) {
        alert(result.error)
      } else {
        router.push('/revisions')
      }
    } catch (error) {
      console.error('Error creating revision:', error)
      alert('Failed to create revision')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/revisions">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <RotateCcw className="h-8 w-8 text-blue-600" />
            Add Revision
          </h1>
          <p className="text-muted-foreground mt-1">
            Record a revision session for a topic
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic_id">Topic *</Label>
            <Select
              value={formData.topic_id}
              onValueChange={(value: string) =>
                setFormData({ ...formData, topic_id: value })
              }
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    <div className="flex items-center gap-2">
                      {topic.subjects && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: topic.subjects.color }}
                        />
                      )}
                      <span>{topic.name}</span>
                      {topic.subjects && (
                        <span className="text-xs text-gray-500">
                          ({topic.subjects.name})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Revision Date */}
          <div className="space-y-2">
            <Label htmlFor="revision_date">Revision Date *</Label>
            <Input
              id="revision_date"
              type="date"
              value={formData.revision_date}
              onChange={(e) =>
                setFormData({ ...formData, revision_date: e.target.value })
              }
              required
              className="bg-white"
            />
          </div>

          {/* Confidence Level */}
          <div className="space-y-2">
            <Label htmlFor="confidence_level">
              Confidence Level (1-5) *
            </Label>
            <Select
              value={formData.confidence_level}
              onValueChange={(value: string) =>
                setFormData({ ...formData, confidence_level: value })
              }
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="1">1 - Very Low</SelectItem>
                <SelectItem value="2">2 - Low</SelectItem>
                <SelectItem value="3">3 - Medium</SelectItem>
                <SelectItem value="4">4 - High</SelectItem>
                <SelectItem value="5">5 - Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Next Revision Date */}
          <div className="space-y-2">
            <Label htmlFor="next_revision_date">
              Next Revision Date (Optional)
            </Label>
            <Input
              id="next_revision_date"
              type="date"
              value={formData.next_revision_date}
              onChange={(e) =>
                setFormData({ ...formData, next_revision_date: e.target.value })
              }
              className="bg-white"
            />
            <p className="text-xs text-gray-500">
              Leave empty to auto-calculate based on spaced repetition
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any notes about this revision session..."
              rows={4}
              className="bg-white"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Revision'}
            </Button>
            <Link href="/revisions" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

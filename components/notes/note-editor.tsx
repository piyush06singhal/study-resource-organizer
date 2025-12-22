'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createNote, updateNote, generateNoteSummary } from '@/lib/actions/notes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Save, Sparkles, Bold, Italic, List, ListOrdered, 
  Code, Quote, Heading1, Heading2, Link as LinkIcon,
  Image as ImageIcon, Table, Eye, Edit3
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'

export function NoteEditor({ note, subjects, isNew }: { note: any; subjects: any[]; isNew: boolean }) {
  const router = useRouter()
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [subjectId, setSubjectId] = useState(note?.subject_id || '')
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      if (isNew) {
        const newNote = await createNote({
          title,
          content,
          contentType: 'markdown',
          subjectId: subjectId || undefined,
          tags
        })
        router.push(`/notes/${(newNote as any).id}`)
      } else {
        await updateNote(note.id, {
          title,
          content,
          subjectId: subjectId || undefined,
          tags
        })
      }
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateSummary = async () => {
    if (!content.trim()) return
    
    setGenerating(true)
    try {
      const summary = await generateNoteSummary(content)
      setContent((prev: string) => `## Summary\n\n${summary}\n\n---\n\n${prev}`)
    } catch (error) {
      console.error(error)
    } finally {
      setGenerating(false)
    }
  }

  const insertMarkdown = (syntax: string, placeholder = '') => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end) || placeholder
    const newText = content.substring(0, start) + syntax.replace('{}', selectedText) + content.substring(end)
    
    setContent(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + syntax.indexOf('{}'), start + syntax.indexOf('{}') + selectedText.length)
    }, 0)
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="text-2xl font-bold border-0 focus-visible:ring-0 px-0"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded" 
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tags..."
                />
                <Button onClick={addTag} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-blue-200"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <span className="text-xs">×</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Editor */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
              <TabsList>
                <TabsTrigger value="edit">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateSummary} 
                variant="outline" 
                size="sm"
                disabled={generating || !content.trim()}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generating ? 'Generating...' : 'AI Summary'}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Note'}
              </Button>
            </div>
          </div>

          {mode === 'edit' && (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg border">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('**{}**', 'bold text')}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('*{}*', 'italic text')}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('# {}', 'Heading 1')}
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('## {}', 'Heading 2')}
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('- {}', 'list item')}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('1. {}', 'list item')}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('`{}`', 'code')}
                  title="Inline Code"
                >
                  <Code className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('```\n{}\n```', 'code block')}
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('> {}', 'quote')}
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('[{}](url)', 'link text')}
                  title="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('![alt text]({})', 'image-url')}
                  title="Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => insertMarkdown('$${}$$', 'LaTeX equation')}
                  title="Math Equation"
                >
                  <span className="text-sm font-bold">Σ</span>
                </Button>
              </div>

              {/* Editor Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your notes... Supports Markdown, LaTeX math, and code syntax highlighting!"
                className="w-full min-h-[500px] p-4 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Quick Guide */}
              <div className="text-xs text-gray-500 space-y-1 p-4 bg-gray-50 rounded">
                <p className="font-semibold">Quick Guide:</p>
                <p>• **bold** or *italic* for formatting</p>
                <p>• # Heading or ## Subheading for headers</p>
                <p>• ```language for code blocks with syntax highlighting</p>
                <p>• $$ E = mc^2 $$ for LaTeX math equations</p>
                <p>• - or 1. for lists</p>
              </div>
            </>
          )}

          {mode === 'preview' && (
            <div className="prose prose-blue max-w-none min-h-[500px] p-6 border rounded-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {content || '*No content yet. Start writing in edit mode!*'}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

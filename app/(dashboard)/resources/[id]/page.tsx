import { getResourceById } from '@/lib/actions/resources'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, ArrowLeft, ExternalLink, Download, FileText, Image as ImageIcon, Link as LinkIcon, StickyNote, Video } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'

export default async function ResourceDetailPage({ params }: { params: { id: string } }) {
  const resource = await getResourceById(params.id)

  if (!resource) {
    notFound()
  }

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText className="h-12 w-12 text-red-600" />
      case 'image':
        return <ImageIcon className="h-12 w-12 text-blue-600" />
      case 'link':
        return <LinkIcon className="h-12 w-12 text-green-600" />
      case 'video':
        return <Video className="h-12 w-12 text-purple-600" />
      default:
        return <StickyNote className="h-12 w-12 text-yellow-600" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${kb.toFixed(2)} KB`
  }

  const linkedTopics = resource.resource_topics?.map((rt: any) => rt.topics).filter(Boolean) || []

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/resources">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
      </Link>

      {/* Resource Header */}
      <Card className="p-8 border-2">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1">
              {getTypeIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {resource.type.toUpperCase()}
                </span>
                {resource.file_size && (
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">
                    {formatFileSize(resource.file_size)}
                  </span>
                )}
              </div>
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {resource.url && (
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </a>
            )}
            <Link href={`/resources/${resource.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        {resource.content && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Content</h3>
            <div className="p-4 bg-accent/50 rounded-lg">
              <p className="whitespace-pre-wrap leading-relaxed">{resource.content}</p>
            </div>
          </div>
        )}

        {/* URL Display */}
        {resource.url && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">URL</h3>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {resource.url}
            </a>
          </div>
        )}

        {/* Metadata */}
        <div className="grid md:grid-cols-2 gap-4 pt-6 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-medium">
              {format(new Date(resource.created_at), 'MMM dd, yyyy')}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-medium">
              {format(new Date(resource.updated_at), 'MMM dd, yyyy')}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(resource.updated_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </Card>

      {/* Linked Topics */}
      {linkedTopics.length > 0 && (
        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">Linked Topics</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {linkedTopics.map((topic: any) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="p-3 bg-accent/50 hover:bg-accent rounded-lg transition-colors flex items-center gap-3"
              >
                {topic.subjects && (
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: topic.subjects.color }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{topic.name}</p>
                  {topic.subjects && (
                    <p className="text-xs text-muted-foreground">{topic.subjects.name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* File Preview */}
      {resource.type === 'image' && resource.file_path && (
        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          <div className="rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
            <img
              src={resource.file_path}
              alt={resource.title}
              className="w-full h-auto"
            />
          </div>
        </Card>
      )}

      {resource.type === 'pdf' && resource.file_path && (
        <Card className="p-6 border-2">
          <h2 className="text-xl font-bold mb-4">PDF Preview</h2>
          <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">PDF preview not available</p>
              <a href={resource.file_path} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </a>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

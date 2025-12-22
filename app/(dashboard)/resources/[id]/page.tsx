import { getResourceById } from '@/lib/actions/resources'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, Image, Link as LinkIcon, StickyNote, Video,
  ArrowLeft, Edit, Download, ExternalLink, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default async function ResourceDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const resourceData = await getResourceById(id)

  if (!resourceData) {
    notFound()
  }

  // Type assertion to help TypeScript
  const resource = resourceData as any

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />
      case 'image':
        return <Image className="h-8 w-8 text-blue-600" />
      case 'link':
        return <LinkIcon className="h-8 w-8 text-green-600" />
      case 'video':
        return <Video className="h-8 w-8 text-purple-600" />
      default:
        return <StickyNote className="h-8 w-8 text-yellow-600" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${kb.toFixed(2)} KB`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/resources">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{resource.title}</h1>
            <p className="text-muted-foreground mt-1">
              {resource.type.toUpperCase()}
              {resource.file_size && ` • ${formatFileSize(resource.file_size)}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/resources/${resource.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <Card className="p-8 bg-white">
        <div className="flex items-start gap-6 mb-6">
          <div className="p-4 rounded-xl bg-gray-100">
            {getTypeIcon()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">{resource.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(resource.created_at), 'MMM dd, yyyy')}
              </span>
              {resource.updated_at && resource.updated_at !== resource.created_at && (
                <span>Updated {format(new Date(resource.updated_at), 'MMM dd, yyyy')}</span>
              )}
            </div>
          </div>
        </div>

        {/* URL for links/videos */}
        {resource.url && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">URL</h3>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              {resource.url}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        {/* File preview for images */}
        {resource.type === 'image' && resource.file_path && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Preview</h3>
            <img
              src={resource.file_path}
              alt={resource.title}
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        )}

        {/* Content/Description */}
        {resource.content && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              {resource.type === 'note' ? 'Content' : 'Description'}
            </h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{resource.content}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {resource.tags && Array.isArray(resource.tags) && resource.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Linked Topics */}
        {resource.resource_topics && Array.isArray(resource.resource_topics) && resource.resource_topics.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Linked Topics</h3>
            <div className="grid gap-2">
              {resource.resource_topics.map((rt: any) => (
                <Link
                  key={rt.topics.id}
                  href={`/topics/${rt.topics.id}`}
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {rt.topics.subjects && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: rt.topics.subjects.color }}
                    />
                  )}
                  <span className="font-medium">{rt.topics.name}</span>
                  {rt.topics.subjects && (
                    <span className="text-sm text-gray-500">
                      ({rt.topics.subjects.name})
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Download button for files */}
        {resource.file_path && (resource.type === 'pdf' || resource.type === 'image') && (
          <div className="pt-4 border-t">
            <a href={resource.file_path} download target="_blank" rel="noopener noreferrer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </a>
          </div>
        )}
      </Card>
    </div>
  )
}

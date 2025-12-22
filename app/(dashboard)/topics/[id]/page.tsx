import { getTopicById } from '@/lib/actions/topics'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, BookOpen, Calendar, TrendingUp, FileText } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default async function TopicDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const topicData = await getTopicById(id)

  if (!topicData) {
    notFound()
  }

  const topic = topicData as any

  const getStatusColor = () => {
    switch (topic.status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = () => {
    switch (topic.priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/topics">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
            {topic.subjects && (
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: topic.subjects.color }}
                />
                <p className="text-muted-foreground">{topic.subjects.name}</p>
              </div>
            )}
          </div>
        </div>
        <Link href={`/topics/${topic.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <Card className="p-8 bg-white">
        {/* Status and Priority */}
        <div className="flex gap-2 mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {topic.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </span>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor()}`}>
            {topic.priority.charAt(0).toUpperCase() + topic.priority.slice(1)} Priority
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Subject */}
          {topic.subjects && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Subject</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: topic.subjects.color }}
                  />
                  <p className="text-base font-semibold">{topic.subjects.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Created</p>
              <p className="text-base font-semibold">
                {format(new Date(topic.created_at), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          {topic.updated_at && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-base font-semibold">
                  {format(new Date(topic.updated_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          )}

          {/* Revisions Count */}
          {topic.revisions && topic.revisions.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revisions</p>
                <p className="text-base font-semibold">{topic.revisions.length} completed</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {topic.description && (
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{topic.description}</p>
          </div>
        )}

        {/* Revisions History */}
        {topic.revisions && topic.revisions.length > 0 && (
          <div className="pt-6 border-t mt-6">
            <h3 className="font-semibold mb-4">Revision History</h3>
            <div className="space-y-3">
              {topic.revisions.map((revision: any) => (
                <Card key={revision.id} className="p-4 border-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Revision #{revision.revision_number}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(revision.revision_date), 'MMM d, yyyy')}
                      </p>
                      {revision.notes && (
                        <p className="text-sm text-gray-700 mt-1">{revision.notes}</p>
                      )}
                    </div>
                    {revision.confidence_level && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < revision.confidence_level ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

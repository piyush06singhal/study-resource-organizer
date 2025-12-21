import { getTopicById } from '@/lib/actions/topics'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, ArrowLeft, CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'

export default async function TopicDetailPage({ params }: { params: { id: string } }) {
  const topic = await getTopicById(params.id)

  if (!topic) {
    notFound()
  }

  const getStatusIcon = () => {
    switch (topic.status) {
      case 'completed':
        return <CheckCircle2 className="h-8 w-8 text-green-600" />
      case 'in_progress':
        return <Clock className="h-8 w-8 text-blue-600" />
      default:
        return <Circle className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (topic.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
    }
  }

  const getPriorityColor = () => {
    switch (topic.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    }
  }

  const revisions = topic.revisions || []
  const revisionCount = revisions.length

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/topics">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Topics
        </Button>
      </Link>

      {/* Topic Header */}
      <Card className="p-8 border-2">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1">
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{topic.name}</h1>
              {topic.subjects && (
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: topic.subjects.color }}
                  />
                  <Link 
                    href={`/subjects/${topic.subjects.id}`}
                    className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {topic.subjects.name}
                  </Link>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium border-2',
                  getStatusColor()
                )}>
                  {topic.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium border-2',
                  getPriorityColor()
                )}>
                  {topic.priority.charAt(0).toUpperCase() + topic.priority.slice(1)} Priority
                </span>
              </div>
            </div>
          </div>
          <Link href={`/topics/${topic.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>

        {topic.description && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{topic.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-medium">
              {format(new Date(topic.created_at), 'MMM dd, yyyy')}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-medium">
              {format(new Date(topic.updated_at), 'MMM dd, yyyy')}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(topic.updated_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </Card>

      {/* Revision History */}
      <Card className="p-6 border-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Revision History</h2>
          <Link href={`/revisions/new?topic=${topic.id}`}>
            <Button size="sm">
              Add Revision
            </Button>
          </Link>
        </div>

        {revisionCount > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">{revisionCount}</p>
                <p className="text-xs text-muted-foreground">Total Revisions</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {revisions[revisions.length - 1]?.confidence_level || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">Latest Confidence</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {revisions[revisions.length - 1]?.revision_date 
                    ? formatDistanceToNow(new Date(revisions[revisions.length - 1].revision_date), { addSuffix: true })
                    : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">Last Revision</p>
              </div>
            </div>

            {revisions.slice().reverse().map((revision: any, index: number) => (
              <div
                key={revision.id}
                className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">Revision #{revision.revision_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(revision.revision_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  {revision.confidence_level && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-2 h-2 rounded-full',
                            i < revision.confidence_level
                              ? 'bg-green-500'
                              : 'bg-gray-300 dark:bg-gray-700'
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {revision.notes && (
                  <p className="text-sm text-muted-foreground">{revision.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No revisions yet</p>
            <p className="text-xs">Start tracking your revision progress</p>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-2">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href={`/resources/new?topic=${topic.id}`}>
            <Button variant="outline" className="w-full h-16 flex-col gap-2">
              <span className="text-2xl">📚</span>
              <span>Add Resource</span>
            </Button>
          </Link>
          <Link href={`/revisions/new?topic=${topic.id}`}>
            <Button variant="outline" className="w-full h-16 flex-col gap-2">
              <span className="text-2xl">🔄</span>
              <span>Add Revision</span>
            </Button>
          </Link>
          <Link href={`/planner/new?topic=${topic.id}`}>
            <Button variant="outline" className="w-full h-16 flex-col gap-2">
              <span className="text-2xl">📅</span>
              <span>Schedule Study</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

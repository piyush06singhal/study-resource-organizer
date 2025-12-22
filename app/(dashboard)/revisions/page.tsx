import { getRevisions, getTopicsNeedingRevision } from '@/lib/actions/revisions'
import { getTopics } from '@/lib/actions/topics'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, RotateCcw, AlertCircle, Brain, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'

export default async function RevisionsPage() {
  const [revisions, topicsNeedingRevision, allTopics] = await Promise.all([
    getRevisions(),
    getTopicsNeedingRevision(),
    getTopics()
  ])

  // Calculate stats
  const totalRevisions = revisions.length
  const topicsWithRevisions = new Set(revisions.map((r: any) => r.topic_id)).size
  const avgConfidence = revisions.length > 0
    ? Math.round(revisions.reduce((acc: number, r: any) => acc + (r.confidence_level || 0), 0) / revisions.length * 10) / 10
    : 0
  const dueToday = topicsNeedingRevision.filter((t: any) => {
    const dueDate = new Date(t.next_revision_date)
    const today = new Date()
    return dueDate.toDateString() === today.toDateString()
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <RotateCcw className="h-8 w-8 text-blue-600" />
            Revisions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your revision progress with spaced repetition
          </p>
        </div>
        <Link href="/revisions/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Add Revision
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <RotateCcw className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revisions</p>
              <p className="text-3xl font-bold text-gray-900">{totalRevisions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Topics Tracked</p>
              <p className="text-3xl font-bold text-gray-900">{topicsWithRevisions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-gray-900">{avgConfidence}/5</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Due Today</p>
              <p className="text-3xl font-bold text-gray-900">{dueToday}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Topics Needing Revision */}
      {topicsNeedingRevision.length > 0 && (
        <Card className="p-6 border-2 border-orange-300 bg-orange-50">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Topics Due for Revision
              </h2>
              <p className="text-sm text-gray-700">
                {topicsNeedingRevision.length} topic{topicsNeedingRevision.length !== 1 ? 's' : ''} need{topicsNeedingRevision.length === 1 ? 's' : ''} revision
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topicsNeedingRevision.map((item: any) => (
              <Link
                key={item.topic_id}
                href={`/revisions/new?topic=${item.topic_id}`}
              >
                <Card className="p-4 hover:shadow-md transition-all hover:-translate-y-1 bg-white border-2">
                  <div className="flex items-center gap-2 mb-1">
                    {item.topics?.subjects && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.topics.subjects.color }}
                      />
                    )}
                    <h3 className="font-semibold text-gray-900">{item.topics?.name}</h3>
                  </div>
                  {item.topics?.subjects && (
                    <p className="text-xs text-gray-600 mb-2">
                      {item.topics.subjects.name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-orange-600" />
                    <span className="text-orange-600 font-medium">
                      Due: {format(new Date(item.next_revision_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Revision History */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Revision History</h2>
        {revisions.length > 0 ? (
          <div className="space-y-3">
            {revisions.map((revision: any) => (
              <Card
                key={revision.id}
                className="p-4 hover:shadow-md transition-shadow border-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {revision.topics?.subjects && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: revision.topics.subjects.color }}
                        />
                      )}
                      <h3 className="font-semibold text-gray-900">{revision.topics?.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                        Revision #{revision.revision_number}
                      </span>
                    </div>
                    {revision.topics?.subjects && (
                      <p className="text-xs text-gray-600 mb-2">
                        {revision.topics.subjects.name}
                      </p>
                    )}
                    {revision.notes && (
                      <p className="text-sm text-gray-700 mb-2">{revision.notes}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(revision.revision_date), 'MMM dd, yyyy')}
                      </span>
                      {revision.confidence_level && (
                        <div className="flex items-center gap-1">
                          <span>Confidence:</span>
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < revision.confidence_level
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {revision.next_revision_date && (
                        <span className="flex items-center gap-1">
                          <RotateCcw className="h-3 w-3" />
                          Next: {format(new Date(revision.next_revision_date), 'MMM dd')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-6 bg-blue-50 rounded-full mb-4">
              <RotateCcw className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No revisions yet</h3>
            <p className="text-gray-600 mb-6">Start tracking your revision progress</p>
            <Link href="/revisions/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Revision
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}

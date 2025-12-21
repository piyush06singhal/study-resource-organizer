import { getRevisions, getTopicsNeedingRevision } from '@/lib/actions/revisions'
import { getTopics } from '@/lib/actions/topics'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, RotateCcw, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'

export default async function RevisionsPage() {
  const [revisions, topicsNeedingRevision, allTopics] = await Promise.all([
    getRevisions(),
    getTopicsNeedingRevision(),
    getTopics()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <RotateCcw className="h-8 w-8 text-primary" />
            Revisions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your revision progress with spaced repetition
          </p>
        </div>
        <Link href="/revisions/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Revision
          </Button>
        </Link>
      </div>

      {/* Topics Needing Revision */}
      {topicsNeedingRevision.length > 0 && (
        <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                Topics Due for Revision
              </h2>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {topicsNeedingRevision.length} topic{topicsNeedingRevision.length !== 1 ? 's' : ''} need{topicsNeedingRevision.length === 1 ? 's' : ''} revision
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {topicsNeedingRevision.map((item: any) => (
              <Link
                key={item.topic_id}
                href={`/revisions/new?topic=${item.topic_id}`}
                className="p-4 bg-white dark:bg-slate-900 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  {item.topics?.subjects && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.topics.subjects.color }}
                    />
                  )}
                  <h3 className="font-semibold">{item.topics?.name}</h3>
                </div>
                {item.topics?.subjects && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.topics.subjects.name}
                  </p>
                )}
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Due: {format(new Date(item.next_revision_date), 'MMM dd, yyyy')}
                </p>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Revision History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Revision History</h2>
        {revisions.length > 0 ? (
          <div className="space-y-3">
            {revisions.map((revision: any) => (
              <div
                key={revision.id}
                className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
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
                      <h3 className="font-semibold">{revision.topics?.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Revision #{revision.revision_number}
                      </span>
                    </div>
                    {revision.topics?.subjects && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {revision.topics.subjects.name}
                      </p>
                    )}
                    {revision.notes && (
                      <p className="text-sm text-muted-foreground mb-2">{revision.notes}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
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
                                  : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {revision.next_revision_date && (
                        <span>
                          Next: {format(new Date(revision.next_revision_date), 'MMM dd')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <RotateCcw className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No revisions yet</p>
            <p className="text-xs">Start tracking your revision progress</p>
          </div>
        )}
      </Card>
    </div>
  )
}

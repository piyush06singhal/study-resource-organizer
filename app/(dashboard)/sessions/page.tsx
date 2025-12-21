import { getStudySessions, getActiveSession, getSessionStats } from '@/lib/actions/sessions'
import { getSubjects } from '@/lib/actions/subjects'
import { getTopics } from '@/lib/actions/topics'
import { SessionTimer } from '@/components/sessions/session-timer'
import { Card } from '@/components/ui/card'
import { Clock, Play } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

export default async function SessionsPage() {
  const [sessions, activeSession, stats, subjects, topics] = await Promise.all([
    getStudySessions(),
    getActiveSession(),
    getSessionStats(),
    getSubjects(),
    getTopics()
  ])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-8 w-8 text-primary" />
            Study Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your study time and build consistent habits
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Today</p>
          <p className="text-3xl font-bold mt-1">{formatDuration(stats.today)}</p>
        </Card>
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">This Week</p>
          <p className="text-3xl font-bold mt-1">{formatDuration(stats.week)}</p>
        </Card>
        <Card className="p-4 bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-800">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total</p>
          <p className="text-3xl font-bold mt-1">{formatDuration(stats.total)}</p>
        </Card>
      </div>

      <SessionTimer 
        subjects={subjects} 
        topics={topics} 
        activeSession={activeSession}
      />

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Sessions</h2>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 10).map((session: any) => (
              <div
                key={session.id}
                className="p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {session.subjects && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: session.subjects.color }}
                        />
                      )}
                      <span className="font-semibold">
                        {session.subjects?.name || 'General Study'}
                      </span>
                      {session.duration_minutes && (
                        <span className="text-sm px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {formatDuration(session.duration_minutes)}
                        </span>
                      )}
                    </div>
                    {session.topics && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {session.topics.name}
                      </p>
                    )}
                    {session.notes && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {session.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {format(new Date(session.start_time), 'MMM dd, yyyy')}
                      </span>
                      <span>
                        {format(new Date(session.start_time), 'h:mm a')}
                        {session.end_time && ` - ${format(new Date(session.end_time), 'h:mm a')}`}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No study sessions yet</p>
            <p className="text-xs">Start your first session above</p>
          </div>
        )}
      </Card>
    </div>
  )
}

import { getStudySessions, getActiveSession, getSessionStats } from '@/lib/actions/sessions'
import { getSubjects } from '@/lib/actions/subjects'
import { getTopics } from '@/lib/actions/topics'
import { SessionTimer } from '@/components/sessions/session-timer'
import { Card } from '@/components/ui/card'
import { Clock, Play, Calendar, TrendingUp, Flame, BarChart3 } from 'lucide-react'
import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns'

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

  // Calculate average session length
  const avgSessionLength = sessions.length > 0
    ? Math.round(sessions.reduce((acc: number, s: any) => acc + (s.duration_minutes || 0), 0) / sessions.length)
    : 0

  // Calculate total sessions
  const totalSessions = sessions.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-8 w-8 text-blue-600" />
            Study Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your study time and build consistent habits
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.today)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.week)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Time</p>
              <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.total)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
              <p className="text-xs text-gray-500">Avg: {formatDuration(avgSessionLength)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Session Timer */}
      <SessionTimer 
        subjects={subjects} 
        topics={topics} 
        activeSession={activeSession}
      />

      {/* Recent Sessions */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Recent Sessions</h2>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.slice(0, 10).map((session: any) => {
              // Calculate actual duration from start and end time if available
              const actualDuration = session.end_time 
                ? differenceInMinutes(new Date(session.end_time), new Date(session.start_time))
                : session.duration_minutes || 0

              return (
                <Card
                  key={session.id}
                  className="p-4 hover:shadow-md transition-shadow border-2"
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
                        <span className="font-semibold text-gray-900">
                          {session.subjects?.name || 'General Study'}
                        </span>
                        <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {formatDuration(actualDuration)}
                        </span>
                      </div>
                      {session.topics && (
                        <p className="text-sm text-gray-700 mb-1">
                          📚 {session.topics.name}
                        </p>
                      )}
                      {session.notes && (
                        <p className="text-sm text-gray-600 mb-2 italic">
                          "{session.notes}"
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(session.start_time), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(session.start_time), 'h:mm a')}
                          {session.end_time && ` - ${format(new Date(session.end_time), 'h:mm a')}`}
                        </span>
                        <span className="text-gray-500">
                          • {formatDistanceToNow(new Date(session.start_time), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-6 bg-blue-50 rounded-full mb-4">
              <Play className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No study sessions yet</h3>
            <p className="text-gray-600">Start your first session above to begin tracking your study time</p>
          </div>
        )}
      </Card>
    </div>
  )
}

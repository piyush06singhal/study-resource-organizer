import { getStudyPlans, getWeeklyStats } from '@/lib/actions/study-plans'
import { CalendarView } from '@/components/planner/calendar-view'
import { WeeklyView } from '@/components/planner/weekly-view'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Calendar as CalendarIcon, List, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { startOfWeek, format } from 'date-fns'

export default async function PlannerPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const params = await searchParams
  const view = params.view || 'calendar'
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  const [plans, weekStats] = await Promise.all([
    getStudyPlans({ month: format(today, 'yyyy-MM-dd') }),
    getWeeklyStats(format(weekStart, 'yyyy-MM-dd'))
  ])

  const todayPlans = plans.filter((p: any) => p.planned_date === format(today, 'yyyy-MM-dd'))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            Study Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan and schedule your study sessions
          </p>
        </div>
        <Link href="/planner/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            New Plan
          </Button>
        </Link>
      </div>

      {/* Weekly Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total plans</p>
              <p className="text-3xl font-bold text-gray-900">{weekStats.totalPlans}</p>
              <p className="text-xs text-gray-500">Planned this week</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{weekStats.completedPlans}</p>
              <p className="text-xs text-gray-500">
                {weekStats.totalPlans > 0 
                  ? `${Math.round((weekStats.completedPlans / weekStats.totalPlans) * 100)}% completion`
                  : '100% completion'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.floor(weekStats.totalMinutes / 60)}h {weekStats.totalMinutes % 60}m
              </p>
              <p className="text-xs text-gray-500">Planned this week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Link href="/planner?view=week">
          <Button variant={view === 'week' ? 'default' : 'outline'} className={view === 'week' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
            <List className="h-4 w-4 mr-2" />
            Week View
          </Button>
        </Link>
        <Link href="/planner?view=calendar">
          <Button variant={view === 'calendar' ? 'default' : 'outline'} className={view === 'calendar' ? 'bg-blue-600 hover:bg-blue-700' : ''}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </Link>
      </div>

      {/* Views */}
      {view === 'calendar' ? (
        <CalendarView plans={plans} />
      ) : (
        <WeeklyView plans={plans} />
      )}
    </div>
  )
}

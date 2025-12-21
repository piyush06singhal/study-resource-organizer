import { getStudyPlans, getWeeklyStats } from '@/lib/actions/study-plans'
import { CalendarView } from '@/components/planner/calendar-view'
import { WeeklyView } from '@/components/planner/weekly-view'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react'
import Link from 'next/link'
import { startOfWeek, format } from 'date-fns'

export default async function PlannerPage({
  searchParams
}: {
  searchParams: { view?: string }
}) {
  const view = searchParams.view || 'week'
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
            <CalendarIcon className="h-8 w-8 text-primary" />
            Study Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan and schedule your study sessions
          </p>
        </div>
        <Link href="/planner/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Plan
          </Button>
        </Link>
      </div>

      {/* Weekly Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">This Week</p>
          <p className="text-3xl font-bold mt-1">{weekStats.totalPlans}</p>
          <p className="text-xs text-muted-foreground">Total plans</p>
        </Card>
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
          <p className="text-3xl font-bold mt-1">{weekStats.completedPlans}</p>
          <p className="text-xs text-muted-foreground">
            {weekStats.totalPlans > 0 
              ? `${Math.round((weekStats.completedPlans / weekStats.totalPlans) * 100)}% completion`
              : 'No plans yet'}
          </p>
        </Card>
        <Card className="p-4 bg-purple-50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-800">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Study Time</p>
          <p className="text-3xl font-bold mt-1">
            {Math.floor(weekStats.totalMinutes / 60)}h {weekStats.totalMinutes % 60}m
          </p>
          <p className="text-xs text-muted-foreground">Planned this week</p>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Link href="/planner?view=week">
          <Button variant={view === 'week' ? 'default' : 'outline'}>
            <List className="h-4 w-4 mr-2" />
            Week View
          </Button>
        </Link>
        <Link href="/planner?view=calendar">
          <Button variant={view === 'calendar' ? 'default' : 'outline'}>
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

      {/* Today's Plans */}
      {todayPlans.length > 0 && view === 'calendar' && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Today's Plans</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {todayPlans.map((plan: any, index: number) => (
              <div key={plan.id}>
                {/* Plan card would go here */}
                <p>{plan.title}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

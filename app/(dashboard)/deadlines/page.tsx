import { getDeadlines, getDeadlineStats } from '@/lib/actions/deadlines'
import { DeadlineCard } from '@/components/deadlines/deadline-card'
import { Button } from '@/components/ui/button'
import { Plus, Target } from 'lucide-react'
import Link from 'next/link'

export default async function DeadlinesPage({
  searchParams
}: {
  searchParams: { status?: string; type?: string; priority?: string }
}) {
  const filters = {
    status: searchParams.status,
    type: searchParams.type,
    priority: searchParams.priority
  }

  const [deadlines, stats] = await Promise.all([
    getDeadlines(filters),
    getDeadlineStats()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Deadlines
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your assignments, exams, and project deadlines
          </p>
        </div>
        <Link href="/deadlines/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Deadline
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border-2">
          <p className="text-sm font-medium text-muted-foreground">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</p>
          <p className="text-3xl font-bold">{stats.overdue}</p>
        </div>
      </div>

      {deadlines.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {deadlines.map((deadline, index) => (
            <DeadlineCard key={deadline.id} deadline={deadline} delay={index * 0.05} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex p-6 bg-primary/10 rounded-full mb-4">
            <Target className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No deadlines yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your first deadline to start tracking
          </p>
          <Link href="/deadlines/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Deadline
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

import { getDeadlines, getDeadlineStats } from '@/lib/actions/deadlines'
import { DeadlineCard } from '@/components/deadlines/deadline-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Target, Clock, CheckCircle2, AlertCircle, List } from 'lucide-react'
import Link from 'next/link'

export default async function DeadlinesPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; type?: string; priority?: string }>
}) {
  const params = await searchParams
  const filters = {
    status: params.status,
    type: params.type,
    priority: params.priority
  }

  const [deadlines, stats] = await Promise.all([
    getDeadlines(filters),
    getDeadlineStats()
  ])

  // Type assertion to help TypeScript understand the structure
  type DeadlineWithSubject = Awaited<ReturnType<typeof getDeadlines>>[number]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Deadlines
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your assignments, exams, and project deadlines
          </p>
        </div>
        <Link href="/deadlines/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Add Deadline
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100">
              <List className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Deadlines Grid */}
      {deadlines.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {deadlines.map((deadline: any, index: number) => (
            <DeadlineCard key={deadline.id} deadline={deadline} delay={index * 0.05} />
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center bg-white">
          <div className="inline-flex p-6 bg-blue-50 rounded-full mb-4">
            <Target className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No deadlines yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first deadline to start tracking
          </p>
          <Link href="/deadlines/new">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Deadline
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

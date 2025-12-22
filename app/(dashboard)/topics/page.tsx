import { getTopics } from '@/lib/actions/topics'
import { TopicCard } from '@/components/topics/topic-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, BookOpen, CheckCircle2, Clock, Circle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function TopicsPage() {
  const topics = await getTopics()

  const completedCount = topics.filter((t: any) => t.status === 'completed').length
  const inProgressCount = topics.filter((t: any) => t.status === 'in_progress').length
  const notStartedCount = topics.filter((t: any) => t.status === 'not_started').length
  const completionRate = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Topics
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your study topics across all subjects
          </p>
        </div>
        <Link href="/topics/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            New Topic
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">{inProgressCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100">
              <Circle className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Not Started</p>
              <p className="text-3xl font-bold text-gray-900">{notStartedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Topics Grid */}
      {topics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic: any, index: number) => (
            <TopicCard key={topic.id} topic={topic} delay={index * 0.05} />
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center bg-white">
          <div className="inline-flex p-6 bg-blue-50 rounded-full mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">No topics yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first topic to start organizing your studies
          </p>
          <Link href="/topics/new">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Topic
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

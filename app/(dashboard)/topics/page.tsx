import { getTopics } from '@/lib/actions/topics'
import { TopicCard } from '@/components/topics/topic-card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function TopicsPage() {
  const topics = await getTopics()

  const completedCount = topics.filter((t: any) => t.status === 'completed').length
  const inProgressCount = topics.filter((t: any) => t.status === 'in_progress').length
  const notStartedCount = topics.filter((t: any) => t.status === 'not_started').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Topics
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your study topics across all subjects
          </p>
        </div>
        <Link href="/topics/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Topic
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
          <p className="text-3xl font-bold mt-1">{completedCount}</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</p>
          <p className="text-3xl font-bold mt-1">{inProgressCount}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg border-2 border-gray-200 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Started</p>
          <p className="text-3xl font-bold mt-1">{notStartedCount}</p>
        </div>
      </div>

      {topics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic: any, index: number) => (
            <TopicCard key={topic.id} topic={topic} delay={index * 0.05} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex p-6 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No topics yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first topic to start organizing your studies
          </p>
          <Link href="/topics/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Topic
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

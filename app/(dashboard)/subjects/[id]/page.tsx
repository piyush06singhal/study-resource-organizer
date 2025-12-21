import { getSubjectById } from '@/lib/actions/subjects'
import { getTopics } from '@/lib/actions/topics'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Plus, Edit, BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TopicCard } from '@/components/topics/topic-card'

export default async function SubjectDetailPage({ params }: { params: { id: string } }) {
  const subject = await getSubjectById(params.id)

  if (!subject) {
    notFound()
  }

  const topics = await getTopics(params.id)

  const completedTopics = topics.filter((t: any) => t.status === 'completed').length
  const inProgressTopics = topics.filter((t: any) => t.status === 'in_progress').length
  const notStartedTopics = topics.filter((t: any) => t.status === 'not_started').length
  const progress = topics.length > 0 ? Math.round((completedTopics / topics.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/subjects">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Subjects
        </Button>
      </Link>

      {/* Subject Header */}
      <Card className="p-8 border-2">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: subject.color + '20' }}
            >
              <BookOpen className="h-8 w-8" style={{ color: subject.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{subject.name}</h1>
              {subject.code && (
                <p className="text-lg text-muted-foreground">{subject.code}</p>
              )}
              {subject.semesters && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subject.semesters.name}
                </p>
              )}
            </div>
          </div>
          <Link href={`/subjects/${subject.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>

        {subject.description && (
          <p className="text-muted-foreground mb-6">{subject.description}</p>
        )}

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Overall Progress</span>
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{completedTopics}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{inProgressTopics}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{notStartedTopics}</p>
              <p className="text-xs text-muted-foreground">Not Started</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Topics Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Topics</h2>
        <Link href={`/topics/new?subject=${subject.id}`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Topic
          </Button>
        </Link>
      </div>

      {topics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, index) => (
            <TopicCard key={topic.id} topic={topic} delay={index * 0.1} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No topics yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your first topic to start organizing this subject
          </p>
          <Link href={`/topics/new?subject=${subject.id}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Topic
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

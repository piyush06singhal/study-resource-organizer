import { getSubjectById } from '@/lib/actions/subjects'
import { getTopics } from '@/lib/actions/topics'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, BookOpen, Calendar, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { TopicCard } from '@/components/topics/topic-card'

export default async function SubjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [subjectData, topics] = await Promise.all([
    getSubjectById(id),
    getTopics(id)
  ])

  if (!subjectData) {
    notFound()
  }

  const subject = subjectData as any

  // Calculate progress
  const totalTopics = topics.length
  const completedTopics = topics.filter((t: any) => t.status === 'completed').length
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/subjects">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
            {subject.code && (
              <p className="text-muted-foreground mt-1">{subject.code}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/topics/new?subject=${subject.id}`}>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </Link>
          <Link href={`/subjects/${subject.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: subject.color + '20' }}>
              <BookOpen className="h-6 w-6" style={{ color: subject.color }} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Topics</p>
              <p className="text-3xl font-bold text-gray-900">{totalTopics}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedTopics}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 hover:shadow-lg transition-shadow bg-white">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-3xl font-bold text-gray-900">{progress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Subject Details */}
      <Card className="p-8 bg-white">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Color */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: subject.color + '20' }}>
              <div className="w-5 h-5 rounded-full" style={{ backgroundColor: subject.color }} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Color</p>
              <p className="text-base font-semibold">{subject.color}</p>
            </div>
          </div>

          {/* Semester */}
          {subject.semesters && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Semester</p>
                <p className="text-base font-semibold">{subject.semesters.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {subject.description && (
          <div className="pt-6 border-t mt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{subject.description}</p>
          </div>
        )}
      </Card>

      {/* Topics List */}
      <div>
        <div className="flex items-center justify-between mb-4">
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
            <p className="text-gray-600 mb-6">Add your first topic to start studying</p>
            <Link href={`/topics/new?subject=${subject.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Topic
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}

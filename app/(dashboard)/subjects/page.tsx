import { getSubjects } from '@/lib/actions/subjects'
import { SubjectCard } from '@/components/subjects/subject-card'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function SubjectsPage() {
  const subjects = await getSubjects()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Subjects
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your subjects and track progress
          </p>
        </div>
        <Link href="/subjects/new">
          <Button size="lg">
            <Plus className="h-5 w-5 mr-2" />
            New Subject
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Subjects</p>
          <p className="text-3xl font-bold mt-1">{subjects.length}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Topics</p>
          <p className="text-3xl font-bold mt-1">
            {subjects.reduce((acc, s) => acc + s.topicsCount, 0)}
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Progress</p>
          <p className="text-3xl font-bold mt-1">
            {subjects.length > 0
              ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      {subjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={subject} delay={index * 0.1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex p-6 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No subjects yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first subject to start organizing your studies
          </p>
          <Link href="/subjects/new">
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Subject
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

import { getStudyPlanById } from '@/lib/actions/study-plans'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Calendar, Clock, BookOpen, FileText } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default async function StudyPlanDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const planData = await getStudyPlanById(id)

  if (!planData) {
    notFound()
  }

  // Type assertion to help TypeScript
  const plan = planData as any

  const formatTime = (time?: string) => {
    if (!time) return ''
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = () => {
    switch (plan.status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'skipped':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-purple-100 text-purple-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/planner">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{plan.title}</h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(plan.planned_date), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <Link href={`/planner/${plan.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <Card className="p-8 bg-white">
        {/* Status */}
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {plan.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p className="text-base font-semibold">
                {format(new Date(plan.planned_date), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Time */}
          {plan.start_time && plan.end_time && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Time</p>
                <p className="text-base font-semibold">
                  {formatTime(plan.start_time)} - {formatTime(plan.end_time)}
                </p>
              </div>
            </div>
          )}

          {/* Duration */}
          {plan.estimated_minutes && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-base font-semibold">
                  {plan.estimated_minutes} minutes
                </p>
              </div>
            </div>
          )}

          {/* Subject */}
          {plan.subjects && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Subject</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: plan.subjects.color }}
                  />
                  <p className="text-base font-semibold">{plan.subjects.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Topic */}
          {plan.topics && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <FileText className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Topic</p>
                <p className="text-base font-semibold">{plan.topics.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {plan.description && (
          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{plan.description}</p>
          </div>
        )}
      </Card>
    </div>
  )
}

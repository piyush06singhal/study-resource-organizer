import { getStudyPlanById } from '@/lib/actions/study-plans'
import { getSubjects } from '@/lib/actions/subjects'
import { getTopics } from '@/lib/actions/topics'
import { StudyPlanForm } from '@/components/planner/study-plan-form'
import { notFound } from 'next/navigation'

export default async function EditPlanPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const [plan, subjects, topics] = await Promise.all([
    getStudyPlanById(id),
    getSubjects(),
    getTopics()
  ])

  if (!plan) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <StudyPlanForm plan={plan} subjects={subjects} topics={topics} />
    </div>
  )
}

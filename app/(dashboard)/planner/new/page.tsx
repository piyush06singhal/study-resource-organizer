import { StudyPlanForm } from '@/components/planner/study-plan-form'
import { getSubjects } from '@/lib/actions/subjects'
import { getTopics } from '@/lib/actions/topics'

export default async function NewPlanPage({
  searchParams
}: {
  searchParams: { date?: string; subject?: string; topic?: string }
}) {
  const [subjects, topics] = await Promise.all([
    getSubjects(),
    getTopics()
  ])

  return (
    <div className="max-w-4xl mx-auto">
      <StudyPlanForm 
        subjects={subjects} 
        topics={topics}
        defaultDate={searchParams.date}
        defaultSubjectId={searchParams.subject}
        defaultTopicId={searchParams.topic}
      />
    </div>
  )
}

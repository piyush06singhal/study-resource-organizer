import { TopicForm } from '@/components/topics/topic-form'
import { getSubjects } from '@/lib/actions/subjects'

export default async function NewTopicPage({
  searchParams
}: {
  searchParams: { subject?: string }
}) {
  const subjects = await getSubjects()

  return (
    <div className="max-w-4xl mx-auto">
      <TopicForm subjects={subjects} defaultSubjectId={searchParams.subject} />
    </div>
  )
}

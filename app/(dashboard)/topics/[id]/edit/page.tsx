import { getTopicById } from '@/lib/actions/topics'
import { getSubjects } from '@/lib/actions/subjects'
import { TopicForm } from '@/components/topics/topic-form'
import { notFound } from 'next/navigation'

export default async function EditTopicPage({ params }: { params: { id: string } }) {
  const [topic, subjects] = await Promise.all([
    getTopicById(params.id),
    getSubjects()
  ])

  if (!topic) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TopicForm topic={topic} subjects={subjects} />
    </div>
  )
}

import { getTopicById } from '@/lib/actions/topics'
import { getSubjects } from '@/lib/actions/subjects'
import { TopicForm } from '@/components/topics/topic-form'
import { notFound } from 'next/navigation'

export default async function EditTopicPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const [topic, subjects] = await Promise.all([
    getTopicById(id),
    getSubjects()
  ])

  if (!topic) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TopicForm topic={topic as any} subjects={subjects} />
    </div>
  )
}

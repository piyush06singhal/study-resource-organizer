import { getDeadlineById } from '@/lib/actions/deadlines'
import { getSubjects } from '@/lib/actions/subjects'
import { DeadlineForm } from '@/components/deadlines/deadline-form'
import { notFound } from 'next/navigation'

export default async function EditDeadlinePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const [deadline, subjects] = await Promise.all([
    getDeadlineById(id),
    getSubjects()
  ])

  if (!deadline) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <DeadlineForm deadline={deadline as any} subjects={subjects} />
    </div>
  )
}

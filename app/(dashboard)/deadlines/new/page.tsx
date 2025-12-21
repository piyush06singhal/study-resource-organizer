import { DeadlineForm } from '@/components/deadlines/deadline-form'
import { getSubjects } from '@/lib/actions/subjects'

export default async function NewDeadlinePage() {
  const subjects = await getSubjects()

  return (
    <div className="max-w-4xl mx-auto">
      <DeadlineForm subjects={subjects} />
    </div>
  )
}

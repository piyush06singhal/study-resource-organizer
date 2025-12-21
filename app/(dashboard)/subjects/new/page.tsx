import { SubjectForm } from '@/components/subjects/subject-form'
import { getSemesters } from '@/lib/actions/subjects'

export default async function NewSubjectPage() {
  const semesters = await getSemesters()

  return (
    <div className="max-w-4xl mx-auto">
      <SubjectForm semesters={semesters} />
    </div>
  )
}

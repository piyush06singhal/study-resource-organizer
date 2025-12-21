import { getSubjectById, getSemesters } from '@/lib/actions/subjects'
import { SubjectForm } from '@/components/subjects/subject-form'
import { notFound } from 'next/navigation'

export default async function EditSubjectPage({ params }: { params: { id: string } }) {
  const [subject, semesters] = await Promise.all([
    getSubjectById(params.id),
    getSemesters()
  ])

  if (!subject) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SubjectForm subject={subject} semesters={semesters} />
    </div>
  )
}

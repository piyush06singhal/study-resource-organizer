import { getNote } from '@/lib/actions/notes'
import { getSubjects } from '@/lib/actions/subjects'
import { NoteEditor } from '@/components/notes/note-editor'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NoteEditPage({ params }: { params: { id: string } }) {
  const [note, subjects] = await Promise.all([
    params.id === 'new' ? null : getNote(params.id),
    getSubjects()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/notes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Link>
        </Button>
      </div>

      <NoteEditor 
        note={note as any} 
        subjects={subjects as any[]}
        isNew={params.id === 'new'}
      />
    </div>
  )
}

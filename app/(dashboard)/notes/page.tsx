import { getNotes, getAllTags } from '@/lib/actions/notes'
import { getSubjects } from '@/lib/actions/subjects'
import { NotesGrid } from '@/components/notes/notes-grid'
import { CreateNoteButton } from '@/components/notes/create-note-button'
import { NotesFilters } from '@/components/notes/notes-filters'
import { BookOpen, Plus } from 'lucide-react'
import { Suspense } from 'react'

async function NotesContent({ searchParams }: { searchParams: any }) {
  const [notes, tags, subjects] = await Promise.all([
    getNotes({
      subjectId: searchParams.subject,
      tag: searchParams.tag,
      search: searchParams.search
    }),
    getAllTags(),
    getSubjects()
  ])

  return (
    <>
      <NotesFilters 
        tags={tags as string[]} 
        subjects={subjects as any[]}
        currentFilters={{
          subject: searchParams.subject,
          tag: searchParams.tag,
          search: searchParams.search
        }}
      />
      <NotesGrid notes={notes as any[]} />
    </>
  )
}

export default function NotesPage({ searchParams }: { searchParams: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and organize your study notes with rich formatting
          </p>
        </div>
        <CreateNoteButton />
      </div>

      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-lg" />}>
        <NotesContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

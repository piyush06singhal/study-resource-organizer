import { getNotes, getAllTags } from '@/lib/actions/notes'
import { getSubjects } from '@/lib/actions/subjects'
import { NotesGrid } from '@/components/notes/notes-grid'
import { CreateNoteButton } from '@/components/notes/create-note-button'
import { NotesFilters } from '@/components/notes/notes-filters'
import { BookOpen, Sparkles, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'

async function NotesContent({ searchParams }: { searchParams: any }) {
  try {
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
  } catch (error: any) {
    return (
      <Card className="p-12 border-2 border-red-200 bg-red-50">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex p-4 bg-red-100 rounded-2xl mb-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Notes</h3>
          <p className="text-red-700 mb-4">
            {error.message || 'An error occurred while loading your notes.'}
          </p>
          <div className="text-left bg-white p-4 rounded-lg border border-red-200">
            <p className="text-sm font-semibold text-gray-900 mb-2">Possible solutions:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Make sure you're logged in</li>
              <li>• Check if the database is set up correctly</li>
              <li>• Verify your Supabase connection</li>
              <li>• Try refreshing the page</li>
            </ul>
          </div>
        </div>
      </Card>
    )
  }
}

export default function NotesPage({ searchParams }: { searchParams: any }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Notes
          </h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Create and organize your study notes with rich formatting
          </p>
        </div>
        <CreateNoteButton />
      </div>

      {/* Content */}
      <Suspense fallback={
        <Card className="p-12 border-2 bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading your notes...</p>
          </div>
        </Card>
      }>
        <NotesContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

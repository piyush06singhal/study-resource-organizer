import { getNote } from '@/lib/actions/notes'
import { getSubjects } from '@/lib/actions/subjects'
import { NoteEditor } from '@/components/notes/note-editor'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default async function NoteEditPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  try {
    const [note, subjects] = await Promise.all([
      id === 'new' ? null : getNote(id),
      getSubjects()
    ])

    // If trying to edit a note that doesn't exist
    if (id !== 'new' && !note) {
      return (
        <div className="space-y-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/notes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Link>
          </Button>
          <Card className="p-12 border-2 border-orange-200 bg-orange-50">
            <div className="text-center max-w-md mx-auto">
              <div className="inline-flex p-4 bg-orange-100 rounded-2xl mb-4">
                <AlertCircle className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">Note Not Found</h3>
              <p className="text-orange-700 mb-4">
                This note doesn't exist or you don't have access to it.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/notes">Back to Notes</Link>
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/notes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Link>
          </Button>
          {id === 'new' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Creating new note</span>
            </div>
          )}
        </div>

        <NoteEditor 
          note={note as any} 
          subjects={subjects as any[]}
          isNew={id === 'new'}
        />
      </div>
    )
  } catch (error: any) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/notes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Link>
        </Button>
        <Card className="p-12 border-2 border-red-200 bg-red-50">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex p-4 bg-red-100 rounded-2xl mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Note</h3>
            <p className="text-red-700 mb-4">
              {error.message || 'An error occurred while loading this note.'}
            </p>
            <div className="text-left bg-white p-4 rounded-lg border border-red-200 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Possible solutions:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Make sure you're logged in</li>
                <li>• Check if the database is set up correctly</li>
                <li>• Verify your Supabase connection</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link href="/notes">Back to Notes</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}

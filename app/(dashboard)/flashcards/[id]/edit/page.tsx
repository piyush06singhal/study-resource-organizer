import { getDeck } from '@/lib/actions/flashcards'
import { FlashcardEditor } from '@/components/flashcards/flashcard-editor'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default async function EditDeckPage({ params }: { params: { id: string } }) {
  const deck = await getDeck(params.id) as any

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" className="mb-4">
          <Link href={`/flashcards/${params.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Study
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Deck
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              {deck?.name || 'Flashcard Deck'}
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Link href={`/flashcards/${params.id}`}>
              <BookOpen className="w-4 h-4 mr-2" />
              Study Mode
            </Link>
          </Button>
        </div>
      </div>

      {/* Editor Component */}
      <FlashcardEditor deck={deck} />
    </div>
  )
}

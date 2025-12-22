import { getDeck } from '@/lib/actions/flashcards'
import { FlashcardEditor } from '@/components/flashcards/flashcard-editor'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, BookOpen, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default async function EditDeckPage({ params }: { params: { id: string } }) {
  try {
    const deck = await getDeck(params.id) as any

    if (!deck) {
      return (
        <div className="container mx-auto py-8">
          <Card className="p-12 border-2 border-orange-200 bg-orange-50">
            <div className="text-center max-w-md mx-auto">
              <div className="inline-flex p-4 bg-orange-100 rounded-2xl mb-4">
                <AlertCircle className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">Deck Not Found</h3>
              <p className="text-orange-700 mb-4">
                This flashcard deck doesn't exist or you don't have access to it.
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/flashcards">Back to Decks</Link>
              </Button>
            </div>
          </Card>
        </div>
      )
    }

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
  } catch (error: any) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-12 border-2 border-red-200 bg-red-50">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex p-4 bg-red-100 rounded-2xl mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Unable to Load Deck</h3>
            <p className="text-red-700 mb-4">
              {error.message || 'An error occurred while loading this flashcard deck.'}
            </p>
            <div className="text-left bg-white p-4 rounded-lg border border-red-200 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Possible solutions:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Make sure you're logged in</li>
                <li>• Check if the database is set up correctly</li>
                <li>• Verify the deck exists</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link href="/flashcards">Back to Decks</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }
}

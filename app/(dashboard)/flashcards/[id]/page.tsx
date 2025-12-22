import { getDeck } from '@/lib/actions/flashcards'
import { FlashcardStudy } from '@/components/flashcards/flashcard-study'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Brain, Sparkles, Edit, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export default async function FlashcardDeckPage({ params }: { params: { id: string } }) {
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
        <div className="flex justify-between items-start">
          <div>
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/flashcards">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Decks
              </Link>
            </Button>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {deck?.name || 'Flashcard Deck'}
            </h1>
            {deck?.description && (
              <p className="text-gray-600 mt-2">{deck.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="border-2">
              <Link href={`/flashcards/${params.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Deck
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
              <Link href={`/flashcards/${params.id}/quiz`}>
                <Brain className="w-4 h-4 mr-2" />
                Quiz Mode
              </Link>
            </Button>
          </div>
        </div>

        {/* Deck Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-2 bg-white border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{deck?.flashcards?.length || 0}</p>
                <p className="text-xs text-gray-600">Total Cards</p>
              </div>
            </div>
          </Card>
          {deck?.subjects && (
            <Card className="p-4 border-2 bg-white border-purple-200">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg shadow-sm flex items-center justify-center"
                  style={{ backgroundColor: deck.subjects.color }}
                >
                  <span className="text-white font-bold text-lg">
                    {deck.subjects.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{deck.subjects.name}</p>
                  <p className="text-xs text-gray-600">Subject</p>
                </div>
              </div>
            </Card>
          )}
          <Card className="p-4 border-2 bg-white border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Study Mode</p>
                <p className="text-xs text-gray-600">Spaced Repetition</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Study Component */}
        <FlashcardStudy flashcards={deck?.flashcards || []} />
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

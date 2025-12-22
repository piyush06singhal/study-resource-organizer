import { getDeck } from '@/lib/actions/flashcards'
import { FlashcardStudy } from '@/components/flashcards/flashcard-study'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Brain } from 'lucide-react'
import Link from 'next/link'

export default async function FlashcardDeckPage({ params }: { params: { id: string } }) {
  const deck = await getDeck(params.id) as any

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <Button asChild variant="ghost">
          <Link href="/flashcards">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Decks
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/flashcards/${params.id}/quiz`}>
            <Brain className="w-4 h-4 mr-2" />
            Quiz Mode
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{deck?.name || 'Deck'}</h1>
        {deck?.description && (
          <p className="text-muted-foreground mt-2">{deck.description}</p>
        )}
      </div>

      <FlashcardStudy flashcards={deck?.flashcards || []} />
    </div>
  )
}

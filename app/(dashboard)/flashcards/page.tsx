import { getDecks } from '@/lib/actions/flashcards'
import { FlashcardDeckList } from '@/components/flashcards/flashcard-deck-list'

export default async function FlashcardsPage() {
  const decks = await getDecks()

  return (
    <div className="container mx-auto py-8">
      <FlashcardDeckList decks={decks} />
    </div>
  )
}

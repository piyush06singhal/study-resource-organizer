import { getDeck } from '@/lib/actions/flashcards'
import { FlashcardEditor } from '@/components/flashcards/flashcard-editor'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditDeckPage({ params }: { params: { id: string } }) {
  const deck = await getDeck(params.id) as any

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href={`/flashcards/${params.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deck
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit: {deck?.name || 'Deck'}</h1>
        <p className="text-muted-foreground mt-2">Manage your flashcards</p>
      </div>

      <FlashcardEditor deck={deck} />
    </div>
  )
}

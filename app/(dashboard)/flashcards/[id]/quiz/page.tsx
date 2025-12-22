import { getDeck } from '@/lib/actions/flashcards'
import { QuizMode } from '@/components/flashcards/quiz-mode'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function QuizPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const deck = await getDeck(id) as any

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href={`/flashcards/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Study
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quiz Mode: {deck?.name || 'Deck'}</h1>
        <p className="text-muted-foreground mt-2">Test your knowledge</p>
      </div>

      <QuizMode flashcards={deck?.flashcards || []} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { reviewFlashcard } from '@/lib/actions/flashcards'

export function FlashcardStudy({ flashcards }: { flashcards: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())

  const currentCard = flashcards[currentIndex]

  const handleReview = async (quality: number) => {
    if (!currentCard) return
    
    try {
      await reviewFlashcard(currentCard.id, quality)
      setReviewed(new Set(reviewed).add(currentCard.id))
      
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setFlipped(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const goNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setFlipped(false)
    }
  }

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setFlipped(false)
    }
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No cards to review</h3>
        <p className="text-muted-foreground">Add some flashcards to get started</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <span className="text-sm text-muted-foreground">
          Reviewed: {reviewed.size}/{flashcards.length}
        </span>
      </div>

      <Card 
        className="min-h-[300px] p-8 cursor-pointer flex items-center justify-center text-center"
        onClick={() => setFlipped(!flipped)}
      >
        <div className="space-y-4">
          <div className="text-2xl font-medium">
            {flipped ? currentCard.back : currentCard.front}
          </div>
          {currentCard.hint && !flipped && (
            <div className="text-sm text-muted-foreground italic">
              Hint: {currentCard.hint}
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Click to flip
          </div>
        </div>
      </Card>

      {flipped && (
        <div className="space-y-3">
          <p className="text-center text-sm font-medium">How well did you know this?</p>
          <div className="grid grid-cols-5 gap-2">
            <Button onClick={() => handleReview(1)} variant="outline" size="sm">
              Again
            </Button>
            <Button onClick={() => handleReview(2)} variant="outline" size="sm">
              Hard
            </Button>
            <Button onClick={() => handleReview(3)} variant="outline" size="sm">
              Good
            </Button>
            <Button onClick={() => handleReview(4)} variant="outline" size="sm">
              Easy
            </Button>
            <Button onClick={() => handleReview(5)} variant="outline" size="sm">
              Perfect
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={goPrevious} disabled={currentIndex === 0} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={() => setFlipped(!flipped)} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Flip
        </Button>
        <Button onClick={goNext} disabled={currentIndex === flashcards.length - 1} variant="outline">
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

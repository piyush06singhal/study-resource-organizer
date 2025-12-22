'use client'

import { useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFlashcard, updateFlashcard, deleteFlashcard, exportDeck } from '@/lib/actions/flashcards'
import { useRouter } from 'next/navigation'

export function FlashcardEditor({ deck }: { deck: any }) {
  const [flashcards, setFlashcards] = useState(deck.flashcards || [])
  const [newCard, setNewCard] = useState({ front: '', back: '', hint: '' })
  const router = useRouter()

  const handleAddCard = async () => {
    if (!newCard.front || !newCard.back) return
    
    try {
      await createFlashcard({
        deckId: deck.id,
        front: newCard.front,
        back: newCard.back,
        hint: newCard.hint
      })
      setNewCard({ front: '', back: '', hint: '' })
      router.refresh()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Delete this flashcard?')) return
    
    try {
      await deleteFlashcard(cardId)
      setFlashcards(flashcards.filter((c: any) => c.id !== cardId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const data = await exportDeck(deck.id, format)
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${deck.name}.${format}`
      a.click()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button onClick={() => handleExport('json')} variant="outline">
          Export JSON
        </Button>
        <Button onClick={() => handleExport('csv')} variant="outline">
          Export CSV
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Add New Flashcard</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="front">Front (Question)</Label>
            <Input
              id="front"
              value={newCard.front}
              onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
              placeholder="What is the capital of France?"
            />
          </div>
          <div>
            <Label htmlFor="back">Back (Answer)</Label>
            <Input
              id="back"
              value={newCard.back}
              onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
              placeholder="Paris"
            />
          </div>
          <div>
            <Label htmlFor="hint">Hint (Optional)</Label>
            <Input
              id="hint"
              value={newCard.hint}
              onChange={(e) => setNewCard({ ...newCard, hint: e.target.value })}
              placeholder="It's known as the City of Light"
            />
          </div>
          <Button onClick={handleAddCard} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Flashcard
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">Flashcards ({flashcards.length})</h3>
        {flashcards.map((card: any) => (
          <Card key={card.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Front:</span>
                  <p className="mt-1">{card.front}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Back:</span>
                  <p className="mt-1">{card.back}</p>
                </div>
                {card.hint && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Hint:</span>
                    <p className="mt-1 text-sm italic">{card.hint}</p>
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleDeleteCard(card.id)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

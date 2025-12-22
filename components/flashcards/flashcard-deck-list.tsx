'use client'

import { useState } from 'react'
import { Plus, BookOpen, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CreateDeckDialog } from './create-deck-dialog'
import { ShareDeckDialog } from './share-deck-dialog'
import { ImportDeckDialog } from './import-deck-dialog'
import Link from 'next/link'

export function FlashcardDeckList({ decks }: { decks: any[] }) {
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Flashcard Decks</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowImport(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Deck
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <Card key={deck.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{deck.name}</h3>
                {deck.description && (
                  <p className="text-sm text-muted-foreground mt-1">{deck.description}</p>
                )}
              </div>
              <ShareDeckDialog deckId={deck.id} />
            </div>

            {deck.subjects && (
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: deck.subjects.color }}
                />
                <span className="text-sm">{deck.subjects.name}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span>{deck.flashcards?.length || 0} cards</span>
              {deck.tags?.length > 0 && (
                <div className="flex gap-1">
                  {deck.tags.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-secondary rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button asChild className="flex-1" size="sm">
                <Link href={`/flashcards/${deck.id}`}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/flashcards/${deck.id}/edit`}>
                  Edit
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <CreateDeckDialog open={showCreate} onOpenChange={setShowCreate} />
      <ImportDeckDialog open={showImport} onOpenChange={setShowImport} />
    </div>
  )
}

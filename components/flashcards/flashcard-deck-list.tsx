'use client'

import { useState } from 'react'
import { Plus, BookOpen, Upload, Sparkles, Zap, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CreateDeckDialog } from './create-deck-dialog'
import { ShareDeckDialog } from './share-deck-dialog'
import { ImportDeckDialog } from './import-deck-dialog'
import Link from 'next/link'

export function FlashcardDeckList({ decks }: { decks: any[] }) {
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)

  if (!decks || decks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Flashcard Decks
            </h2>
            <p className="text-muted-foreground mt-1">Create and study with spaced repetition</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowImport(true)} variant="outline" className="border-2">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Deck
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <Card className="p-12 border-2 border-dashed border-gray-300 bg-white">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex p-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl shadow-2xl mb-6">
              <Zap className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Start Learning with Flashcards
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Create your first flashcard deck and master any subject with our AI-powered spaced repetition system
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-semibold text-sm mb-1">Smart Learning</h4>
                <p className="text-xs text-gray-600">AI-powered spaced repetition</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold text-sm mb-1">Rich Content</h4>
                <p className="text-xs text-gray-600">Images, hints, and more</p>
              </div>
              <div className="p-4 rounded-xl bg-pink-50 border border-pink-200">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-pink-600" />
                <h4 className="font-semibold text-sm mb-1">Track Progress</h4>
                <p className="text-xs text-gray-600">Monitor your learning journey</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => setShowCreate(true)} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-lg px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Deck
              </Button>
              <Button 
                onClick={() => setShowImport(true)} 
                size="lg"
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-lg px-8"
              >
                <Upload className="w-5 h-5 mr-2" />
                Import Deck
              </Button>
            </div>
          </div>
        </Card>

        <CreateDeckDialog open={showCreate} onOpenChange={setShowCreate} />
        <ImportDeckDialog open={showImport} onOpenChange={setShowImport} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Flashcard Decks
          </h2>
          <p className="text-muted-foreground mt-1">{decks.length} deck{decks.length !== 1 ? 's' : ''} • Keep learning!</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowImport(true)} variant="outline" className="border-2">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            New Deck
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Card key={deck.id} className="p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-300 group bg-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">{deck.name}</h3>
                {deck.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{deck.description}</p>
                )}
              </div>
              <ShareDeckDialog deckId={deck.id} />
            </div>

            {deck.subjects && (
              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-gray-50">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: deck.subjects.color }}
                />
                <span className="text-sm font-medium">{deck.subjects.name}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm mb-4 p-3 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">{deck.flashcards?.length || 0} cards</span>
              </div>
              {deck.tags?.length > 0 && (
                <div className="flex gap-1">
                  {deck.tags.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-white border border-blue-200 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md" size="sm">
                <Link href={`/flashcards/${deck.id}`}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Study
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-2">
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

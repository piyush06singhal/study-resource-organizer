'use client'

import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { shareDeck } from '@/lib/actions/flashcards'

export function ShareDeckDialog({ deckId }: { deckId: string }) {
  const [shareCode, setShareCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleShare = async () => {
    setLoading(true)
    try {
      const result = await shareDeck(deckId, 30) as any
      setShareCode(result?.share_code || '')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Deck</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!shareCode ? (
            <Button onClick={handleShare} disabled={loading} className="w-full">
              {loading ? 'Generating...' : 'Generate Share Code'}
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Share this code with others. It expires in 30 days.
              </p>
              <div className="flex gap-2">
                <Input value={shareCode} readOnly />
                <Button onClick={copyToClipboard} variant="outline">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

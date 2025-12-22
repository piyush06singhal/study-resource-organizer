'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { importSharedDeck } from '@/lib/actions/flashcards'
import { useRouter } from 'next/navigation'

export function ImportDeckDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [shareCode, setShareCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleImport = async () => {
    setLoading(true)
    try {
      await importSharedDeck(shareCode)
      setShareCode('')
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Invalid share code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Deck</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="share">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share Code</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
          </TabsList>
          <TabsContent value="share" className="space-y-4">
            <div>
              <Label htmlFor="shareCode">Enter Share Code</Label>
              <Input
                id="shareCode"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value)}
                placeholder="e.g., abc123xy"
              />
            </div>
            <Button onClick={handleImport} disabled={loading || !shareCode} className="w-full">
              {loading ? 'Importing...' : 'Import Deck'}
            </Button>
          </TabsContent>
          <TabsContent value="file" className="space-y-4">
            <div>
              <Label htmlFor="file">Upload JSON or CSV</Label>
              <Input id="file" type="file" accept=".json,.csv" />
            </div>
            <Button className="w-full">Import from File</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Loader2, RotateCcw } from 'lucide-react'
import { createRevision } from '@/lib/actions/revisions'
import { useRouter, useSearchParams } from 'next/navigation'

export default function NewRevisionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultTopicId = searchParams.get('topic') || ''

  const [formData, setFormData] = useState({
    topic_id: defaultTopicId,
    notes: '',
    confidence_level: 3
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const result = await createRevision(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/revisions')
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-primary" />
              Add Revision
            </h2>
            <p className="text-muted-foreground mt-1">
              Record a revision session for a topic
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Confidence Level</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, confidence_level: level })}
                    className={`flex-1 h-12 rounded-lg border-2 transition-all ${
                      formData.confidence_level >= level
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'bg-muted border-muted-foreground/20 hover:border-muted-foreground/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                1 = Need more practice, 5 = Fully confident
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                placeholder="What did you revise? Any insights?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1 h-12">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Recording...
                  </>
                ) : (
                  'Record Revision'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

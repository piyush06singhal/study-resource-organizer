'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreateNoteButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push('/notes/new')}>
      <Plus className="w-4 h-4 mr-2" />
      New Note
    </Button>
  )
}

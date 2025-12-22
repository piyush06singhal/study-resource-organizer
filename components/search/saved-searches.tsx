'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Trash2 } from 'lucide-react'
import { getSavedSearches, deleteSavedSearch } from '@/lib/actions/search'

export function SavedSearches({ onSelectSearch }: { onSelectSearch: (search: any) => void }) {
  const [searches, setSearches] = useState<any[]>([])

  useEffect(() => {
    loadSearches()
  }, [])

  const loadSearches = async () => {
    const data = await getSavedSearches()
    setSearches(data)
  }

  const handleDelete = async (id: string) => {
    await deleteSavedSearch(id)
    setSearches(searches.filter(s => s.id !== id))
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold flex items-center gap-2 mb-4">
        <Star className="w-4 h-4" />
        Saved Searches
      </h3>
      <div className="space-y-2">
        {searches.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <button
              onClick={() => onSelectSearch(item)}
              className="flex-1 text-left px-3 py-2 hover:bg-secondary rounded text-sm"
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.query}</div>
            </button>
            <Button
              onClick={() => handleDelete(item.id)}
              variant="ghost"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}

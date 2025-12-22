'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Trash2 } from 'lucide-react'
import { getSearchHistory, clearSearchHistory } from '@/lib/actions/search'

export function SearchHistory({ onSelectSearch }: { onSelectSearch: (search: any) => void }) {
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const data = await getSearchHistory()
    setHistory(data)
  }

  const handleClear = async () => {
    if (confirm('Clear all search history?')) {
      await clearSearchHistory()
      setHistory([])
    }
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Searches
        </h3>
        <Button onClick={handleClear} variant="ghost" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {history.slice(0, 10).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSearch(item)}
            className="w-full text-left px-3 py-2 hover:bg-secondary rounded text-sm"
          >
            <div className="font-medium">{item.query}</div>
            <div className="text-xs text-muted-foreground">
              {item.result_count} results • {new Date(item.created_at).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}

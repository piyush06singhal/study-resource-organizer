'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, X, Filter } from 'lucide-react'

interface ResourceFiltersProps {
  allTags: string[]
  currentFilters: {
    type?: string
    search?: string
    tags?: string[]
  }
}

export function ResourceFilters({ allTags, currentFilters }: ResourceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentFilters.search || '')
  const [selectedType, setSelectedType] = useState(currentFilters.type || 'all')
  const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tags || [])
  const [showFilters, setShowFilters] = useState(false)

  function applyFilters() {
    const params = new URLSearchParams()
    
    if (selectedType && selectedType !== 'all') {
      params.set('type', selectedType)
    }
    
    if (search) {
      params.set('search', search)
    }
    
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','))
    }

    router.push(`/resources?${params.toString()}`)
  }

  function clearFilters() {
    setSearch('')
    setSelectedType('all')
    setSelectedTags([])
    router.push('/resources')
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const hasActiveFilters = selectedType !== 'all' || search || selectedTags.length > 0

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search and Type Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="note">📝 Notes</option>
            <option value="pdf">📄 PDFs</option>
            <option value="image">🖼️ Images</option>
            <option value="link">🔗 Links</option>
            <option value="video">🎥 Videos</option>
          </select>

          <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Tags
          </Button>

          <Button onClick={applyFilters}>
            Apply
          </Button>

          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tag Filters */}
        {showFilters && allTags.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Filter by Tags:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                Type: {selectedType}
                <button onClick={() => setSelectedType('all')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                Search: {search}
                <button onClick={() => setSearch('')}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm"
              >
                {tag}
                <button onClick={() => toggleTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

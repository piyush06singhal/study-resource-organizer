'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Save, History, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { advancedSearch, getSearchSuggestions, saveSearch, getSearchHistory } from '@/lib/actions/search'
import { SearchResults } from './search-results'
import { SearchHistory } from './search-history'
import { SavedSearches } from './saved-searches'

export function AdvancedSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  
  const [filters, setFilters] = useState({
    type: [] as string[],
    status: [] as string[],
    priority: [] as string[],
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        const sugg = await getSearchSuggestions(query)
        setSuggestions(sugg)
      } else {
        setSuggestions([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const searchResults = await advancedSearch({ query, ...filters })
      setResults(searchResults)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSearch = async () => {
    const name = prompt('Name this search:')
    if (name) {
      await saveSearch(name, query, filters)
    }
  }

  const toggleFilter = (filterType: 'type' | 'status' | 'priority', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search across all content..."
            className="pl-10"
          />
          {suggestions.length > 0 && (
            <Card className="absolute top-full mt-1 w-full z-10 p-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(suggestion)
                    setSuggestions([])
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-secondary rounded"
                >
                  {suggestion}
                </button>
              ))}
            </Card>
          )}
        </div>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
          <Filter className="w-4 h-4" />
        </Button>
        <Button onClick={() => setShowHistory(!showHistory)} variant="outline">
          <History className="w-4 h-4" />
        </Button>
        <Button onClick={handleSaveSearch} variant="outline">
          <Save className="w-4 h-4" />
        </Button>
      </div>

      {showFilters && (
        <Card className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Content Type</Label>
              <div className="space-y-2 mt-2">
                {['resource', 'topic', 'subject', 'deadline'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={() => toggleFilter('type', type)}
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <div className="space-y-2 mt-2">
                {['not_started', 'in_progress', 'completed'].map(status => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleFilter('status', status)}
                    />
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Priority</Label>
              <div className="space-y-2 mt-2">
                {['low', 'medium', 'high'].map(priority => (
                  <label key={priority} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={() => toggleFilter('priority', priority)}
                    />
                    <span className="capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
        </Card>
      )}

      {showHistory && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchHistory onSelectSearch={(search: any) => {
            setQuery(search.query)
            setFilters(search.filters as any)
            setShowHistory(false)
          }} />
          <SavedSearches onSelectSearch={(search: any) => {
            setQuery(search.query)
            setFilters(search.filters as any)
            setShowHistory(false)
          }} />
        </div>
      )}

      <SearchResults results={results} />
    </div>
  )
}

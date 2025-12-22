'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Save, History, X, Sparkles, BookOpen, FileText, Target, Clock, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { advancedSearch, getSearchSuggestions, saveSearch, getSearchHistory } from '@/lib/actions/search'
import { SearchResults } from './search-results'
import { SearchHistory } from './search-history'
import { SavedSearches } from './saved-searches'
import { motion, AnimatePresence } from 'framer-motion'

export function AdvancedSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
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
    if (!query.trim()) return
    
    setLoading(true)
    setHasSearched(true)
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
      alert('Search saved successfully!')
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

  const clearFilters = () => {
    setFilters({
      type: [],
      status: [],
      priority: [],
      dateFrom: '',
      dateTo: ''
    })
  }

  const activeFiltersCount = filters.type.length + filters.status.length + filters.priority.length + 
    (filters.dateFrom ? 1 : 0) + (filters.dateTo ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="p-6 border-2 bg-white shadow-lg">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for subjects, topics, resources, notes, deadlines..."
                className="pl-10 h-12 text-base border-2 focus:border-blue-500"
              />
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="absolute top-full mt-2 w-full z-10 p-2 border-2 shadow-xl bg-white">
                      <p className="text-xs font-semibold text-gray-500 px-3 py-1">Suggestions</p>
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setQuery(suggestion)
                            setSuggestions([])
                            handleSearch()
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center gap-2 text-gray-900"
                        >
                          <Search className="h-3 w-3 text-gray-400" />
                          {suggestion}
                        </button>
                      ))}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading || !query.trim()} 
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setShowFilters(!showFilters)} 
              variant="outline"
              className="border-2"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <Button 
              onClick={() => setShowHistory(!showHistory)} 
              variant="outline"
              className="border-2"
            >
              <History className="w-4 h-4 mr-2" />
              History & Saved
            </Button>
            <Button 
              onClick={handleSaveSearch} 
              variant="outline"
              disabled={!query.trim()}
              className="border-2"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Search
            </Button>
            {activeFiltersCount > 0 && (
              <Button 
                onClick={clearFilters} 
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 space-y-6 border-2 bg-white shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Advanced Filters</h3>
                  <p className="text-sm text-gray-600">Refine your search results</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">Content Type</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'subject', label: 'Subjects', icon: '📚' },
                      { value: 'topic', label: 'Topics', icon: '📖' },
                      { value: 'resource', label: 'Resources', icon: '📁' },
                      { value: 'deadline', label: 'Deadlines', icon: '⏰' }
                    ].map(type => (
                      <label key={type.value} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type.value)}
                          onChange={() => toggleFilter('type', type.value)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">Status</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'not_started', label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
                      { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
                      { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' }
                    ].map(status => (
                      <label key={status.value} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status.value)}
                          onChange={() => toggleFilter('status', status.value)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">Priority</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', label: 'Low', color: 'text-green-600' },
                      { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
                      { value: 'high', label: 'High', color: 'text-red-600' }
                    ].map(priority => (
                      <label key={priority.value} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.priority.includes(priority.value)}
                          onChange={() => toggleFilter('priority', priority.value)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className={`font-semibold ${priority.color}`}>●</span>
                        <span className="text-sm font-medium text-gray-900">{priority.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-base font-semibold text-gray-900 mb-3 block">Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateFrom" className="text-sm text-gray-700">From Date</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="mt-1 border-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo" className="text-sm text-gray-700">To Date</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="mt-1 border-2"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History & Saved Searches */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchHistory onSelectSearch={(search: any) => {
                setQuery(search.query)
                setFilters(search.filters as any)
                setShowHistory(false)
                handleSearch()
              }} />
              <SavedSearches onSelectSearch={(search: any) => {
                setQuery(search.query)
                setFilters(search.filters as any)
                setShowHistory(false)
                handleSearch()
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State - Before Search */}
      {!hasSearched && !loading && (
        <Card className="p-12 border-2 border-dashed bg-white text-center">
          <div className="max-w-md mx-auto">
            <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
              <Search className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Search</h3>
            <p className="text-gray-600 mb-6">
              Enter keywords above to search across all your study materials. Use filters to narrow down results.
            </p>
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-gray-900 mb-1">💡 Quick Tip</p>
                <p className="text-xs text-gray-600">Try searching for subject names or topic keywords</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-semibold text-gray-900 mb-1">🎯 Pro Tip</p>
                <p className="text-xs text-gray-600">Use filters to find specific content types</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {hasSearched && <SearchResults results={results} loading={loading} query={query} />}
    </div>
  )
}

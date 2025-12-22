import { AdvancedSearch } from '@/components/search/advanced-search'
import { Search, Sparkles, Zap, Filter, History } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Search Everything
        </h1>
        <p className="text-gray-600 mt-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Find anything across your subjects, topics, resources, and notes
        </p>
      </div>

      {/* Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-2 bg-white border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Quick Search</h3>
              <p className="text-xs text-gray-600">Type keywords to search across all your study materials instantly</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-2 bg-white border-purple-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Filter className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Advanced Filters</h3>
              <p className="text-xs text-gray-600">Narrow results by type, status, priority, or date range</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-2 bg-white border-green-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <History className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">Save Searches</h3>
              <p className="text-xs text-gray-600">Save frequent searches and access your search history</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Search Component */}
      <AdvancedSearch />
    </div>
  )
}

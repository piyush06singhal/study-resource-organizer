'use client'

import { Card } from '@/components/ui/card'
import { FileText, BookOpen, Target, AlertCircle, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function SearchResults({ results, loading, query }: { results: any[], loading?: boolean, query?: string }) {
  if (loading) {
    return (
      <Card className="p-12 border-2 bg-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Searching...</p>
      </Card>
    )
  }

  if (results.length === 0 && query) {
    return (
      <Card className="p-12 border-2 bg-white text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex p-4 bg-gray-100 rounded-2xl mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find anything matching "<strong>{query}</strong>"
          </p>
          <div className="text-left space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-gray-900">Try these tips:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Check your spelling</li>
              <li>• Use different keywords</li>
              <li>• Remove some filters</li>
              <li>• Try more general terms</li>
            </ul>
          </div>
        </div>
      </Card>
    )
  }

  if (results.length === 0) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'resource': return <FileText className="w-5 h-5 text-blue-600" />
      case 'topic': return <BookOpen className="w-5 h-5 text-purple-600" />
      case 'subject': return <Target className="w-5 h-5 text-green-600" />
      case 'deadline': return <AlertCircle className="w-5 h-5 text-orange-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resource': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'topic': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'subject': return 'bg-green-100 text-green-700 border-green-200'
      case 'deadline': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getLink = (item: any) => {
    switch (item.searchType) {
      case 'resource': return `/resources/${item.id}`
      case 'topic': return `/topics/${item.id}`
      case 'subject': return `/subjects/${item.id}`
      case 'deadline': return `/deadlines/${item.id}`
      default: return '#'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Search Results</h3>
          <p className="text-sm text-gray-600">Found {results.length} {results.length === 1 ? 'result' : 'results'}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
          <Sparkles className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">Sorted by relevance</span>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={getLink(item)}>
              <Card className="p-5 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 bg-white group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      {getIcon(item.searchType)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.name || item.title}
                      </h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getTypeColor(item.searchType)} flex-shrink-0`}>
                        {item.searchType}
                      </span>
                    </div>
                    {(item.description || item.content) && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {item.description || item.content}
                      </p>
                    )}
                    <div className="flex items-center gap-4 flex-wrap">
                      {item.subjects && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full shadow-sm" 
                            style={{ backgroundColor: item.subjects.color }}
                          />
                          <span className="text-xs font-medium text-gray-700">
                            {item.subjects.name}
                          </span>
                        </div>
                      )}
                      {item.status && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      )}
                      {item.priority && (
                        <span className={`text-xs font-semibold ${
                          item.priority === 'high' ? 'text-red-600' :
                          item.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          ● {item.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

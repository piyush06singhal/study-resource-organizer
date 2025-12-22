'use client'

import { Card } from '@/components/ui/card'
import { FileText, BookOpen, Target, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export function SearchResults({ results }: { results: any[] }) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No results found. Try adjusting your search or filters.</p>
      </div>
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'resource': return <FileText className="w-5 h-5" />
      case 'topic': return <BookOpen className="w-5 h-5" />
      case 'subject': return <Target className="w-5 h-5" />
      case 'deadline': return <AlertCircle className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
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
    <div className="space-y-3">
      <h3 className="font-semibold">Results ({results.length})</h3>
      {results.map((item) => (
        <Link key={item.id} href={getLink(item)}>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex gap-3">
              <div className="text-muted-foreground">
                {getIcon(item.searchType)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{item.name || item.title}</h4>
                  <span className="text-xs px-2 py-1 bg-secondary rounded">
                    {item.searchType}
                  </span>
                </div>
                {(item.description || item.content) && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description || item.content}
                  </p>
                )}
                {item.subjects && (
                  <div className="flex items-center gap-2 mt-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.subjects.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.subjects.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

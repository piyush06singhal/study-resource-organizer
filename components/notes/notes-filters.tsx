'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function NotesFilters({ tags, subjects, currentFilters }: { 
  tags: string[]
  subjects: any[]
  currentFilters: any
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/notes?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search notes..."
            defaultValue={currentFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={currentFilters.subject || ''} onValueChange={(v) => updateFilter('subject', v)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Subjects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Subjects</SelectItem>
          {subjects.map(subject => (
            <SelectItem key={subject.id} value={subject.id}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentFilters.tag || ''} onValueChange={(v) => updateFilter('tag', v)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Tags</SelectItem>
          {tags.map(tag => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

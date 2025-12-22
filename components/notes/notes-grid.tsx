'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Trash2, Edit, Calendar } from 'lucide-react'
import Link from 'next/link'
import { deleteNote, toggleFavorite } from '@/lib/actions/notes'
import { useRouter } from 'next/navigation'

export function NotesGrid({ notes }: { notes: any[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    await deleteNote(id)
    router.refresh()
  }

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    await toggleFavorite(id, !isFavorite)
    router.refresh()
  }

  if (notes.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">No notes found. Create your first note!</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map(note => (
        <Card key={note.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg line-clamp-2">{note.title}</h3>
                {note.subjects && (
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: note.subjects.color }}
                    />
                    <span className="text-xs text-gray-600">{note.subjects.name}</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFavorite(note.id, note.is_favorite)}
              >
                <Star 
                  className={`w-4 h-4 ${note.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                />
              </Button>
            </div>

            <p className="text-sm text-gray-600 line-clamp-3">
              {note.content.substring(0, 150)}...
            </p>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag: string) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(note.updated_at).toLocaleDateString()}
              </div>
              <div className="flex gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/notes/${note.id}`}>
                    <Edit className="w-3 h-3" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(note.id)}
                >
                  <Trash2 className="w-3 h-3 text-red-600" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

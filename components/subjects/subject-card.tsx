'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { BookOpen, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { deleteSubject } from '@/lib/actions/subjects'
import { useRouter } from 'next/navigation'

interface SubjectCardProps {
  subject: {
    id: string
    name: string
    code?: string
    color: string
    description?: string
    topicsCount: number
    completedTopics: number
    progress: number
    semesters?: { name: string } | null
  }
  delay?: number
}

export function SubjectCard({ subject, delay = 0 }: SubjectCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${subject.name}"? This will also delete all associated topics.`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteSubject(subject.id)
    
    if (result.error) {
      alert('Error deleting subject: ' + result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="relative"
    >
      <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: subject.color + '20' }}
            >
              <BookOpen className="h-6 w-6" style={{ color: subject.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{subject.name}</h3>
              {subject.code && (
                <p className="text-sm text-muted-foreground">{subject.code}</p>
              )}
              {subject.semesters && (
                <p className="text-xs text-muted-foreground mt-1">
                  {subject.semesters.name}
                </p>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-10"
                >
                  <Link href={`/subjects/${subject.id}`}>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </Link>
                  <Link href={`/subjects/${subject.id}/edit`}>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Description */}
        {subject.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {subject.description}
          </p>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{subject.completedTopics} completed</span>
            <span>{subject.topicsCount} total topics</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link href={`/subjects/${subject.id}`}>
            <Button variant="outline" className="w-full" size="sm">
              View Topics
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}

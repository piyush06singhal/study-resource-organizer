'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, Image, Link as LinkIcon, StickyNote, Video,
  MoreVertical, Edit, Trash2, Eye, Download, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { deleteResource } from '@/lib/actions/resources'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface ResourceCardProps {
  resource: {
    id: string
    title: string
    type: string
    content?: string
    url?: string
    file_path?: string
    file_size?: number
    tags: string[]
    created_at: string
  }
  delay?: number
}

export function ResourceCard({ resource, delay = 0 }: ResourceCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />
      case 'image':
        return <Image className="h-6 w-6 text-blue-600" />
      case 'link':
        return <LinkIcon className="h-6 w-6 text-green-600" />
      case 'video':
        return <Video className="h-6 w-6 text-purple-600" />
      default:
        return <StickyNote className="h-6 w-6 text-yellow-600" />
    }
  }

  const getTypeColor = () => {
    switch (resource.type) {
      case 'pdf':
        return 'bg-red-100 dark:bg-red-900/20'
      case 'image':
        return 'bg-blue-100 dark:bg-blue-900/20'
      case 'link':
        return 'bg-green-100 dark:bg-green-900/20'
      case 'video':
        return 'bg-purple-100 dark:bg-purple-900/20'
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/20'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${kb.toFixed(2)} KB`
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteResource(resource.id)
    
    if (result.error) {
      alert('Error deleting resource: ' + result.error)
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
      <Card className="p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor()}`}>
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{resource.title}</h3>
              <p className="text-xs text-muted-foreground">
                {resource.type.toUpperCase()}
                {resource.file_size && ` • ${formatFileSize(resource.file_size)}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(resource.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
                >
                  <Link href={`/resources/${resource.id}`}>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </Link>
                  {resource.url && (
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Open Link
                      </button>
                    </a>
                  )}
                  <Link href={`/resources/${resource.id}/edit`}>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-950 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Preview */}
        {resource.content && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {resource.content}
          </p>
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <Link href={`/resources/${resource.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            View Resource
          </Button>
        </Link>
      </Card>
    </motion.div>
  )
}

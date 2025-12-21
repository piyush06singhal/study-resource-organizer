'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Clock, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { deleteTopic, updateTopicStatus } from '@/lib/actions/topics'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TopicCardProps {
  topic: {
    id: string
    name: string
    description?: string
    status: string
    priority: string
    subjects?: { id: string; name: string; color: string } | null
  }
  delay?: number
}

export function TopicCard({ topic, delay = 0 }: TopicCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const getStatusIcon = () => {
    switch (topic.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (topic.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = () => {
    switch (topic.priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      default:
        return 'border-l-blue-500'
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${topic.name}"?`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteTopic(topic.id)
    
    if (result.error) {
      alert('Error deleting topic: ' + result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true)
    await updateTopicStatus(topic.id, newStatus)
    setIsUpdating(false)
    router.refresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="relative"
    >
      <Card className={cn(
        "p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 group",
        getPriorityColor()
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => {
                const nextStatus = topic.status === 'not_started' ? 'in_progress' : topic.status === 'in_progress' ? 'completed' : 'not_started'
                handleStatusChange(nextStatus)
              }}
              disabled={isUpdating}
              className="mt-0.5 hover:scale-110 transition-transform"
            >
              {getStatusIcon()}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{topic.name}</h3>
              {topic.subjects && (
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: topic.subjects.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {topic.subjects.name}
                  </span>
                </div>
              )}
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
                  <Link href={`/topics/${topic.id}`}>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </Link>
                  <Link href={`/topics/${topic.id}/edit`}>
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

        {/* Description */}
        {topic.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {topic.description}
          </p>
        )}

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-xs px-2 py-1 rounded-full font-medium',
            getStatusColor()
          )}>
            {topic.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {topic.priority} priority
          </span>
        </div>
      </Card>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, MoreVertical, Edit, Trash2, AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { deleteDeadline, updateDeadlineStatus } from '@/lib/actions/deadlines'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { formatDistanceToNow, format, differenceInDays } from 'date-fns'

interface DeadlineCardProps {
  deadline: {
    id: string
    title: string
    description?: string
    type: string
    due_date: string
    priority: string
    status: string
    subjects?: { id: string; name: string; color: string } | null
  }
  delay?: number
}

export function DeadlineCard({ deadline, delay = 0 }: DeadlineCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const dueDate = new Date(deadline.due_date)
  const now = new Date()
  const daysUntil = differenceInDays(dueDate, now)
  const isOverdue = daysUntil < 0 && deadline.status === 'pending'

  const getTypeIcon = () => {
    switch (deadline.type) {
      case 'exam':
        return '📝'
      case 'assignment':
        return '📄'
      case 'project':
        return '🎯'
      default:
        return '📌'
    }
  }

  const getPriorityColor = () => {
    switch (deadline.priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      default:
        return 'border-l-blue-500'
    }
  }

  const getUrgencyColor = () => {
    if (deadline.status === 'completed') return 'text-green-600'
    if (isOverdue) return 'text-red-600'
    if (daysUntil === 0) return 'text-orange-600'
    if (daysUntil <= 3) return 'text-yellow-600'
    return 'text-blue-600'
  }

  const getCountdownText = () => {
    if (deadline.status === 'completed') return 'Completed'
    if (isOverdue) return `${Math.abs(daysUntil)} days overdue`
    if (daysUntil === 0) return 'Due today!'
    if (daysUntil === 1) return 'Due tomorrow'
    return `${daysUntil} days left`
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${deadline.title}"?`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteDeadline(deadline.id)
    
    if (result.error) {
      alert('Error deleting deadline: ' + result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  async function handleStatusToggle() {
    setIsUpdating(true)
    const newStatus = deadline.status === 'completed' ? 'pending' : 'completed'
    await updateDeadlineStatus(deadline.id, newStatus)
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
        getPriorityColor(),
        isOverdue && 'bg-red-50 dark:bg-red-950/10'
      )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={handleStatusToggle}
              disabled={isUpdating}
              className="mt-1 hover:scale-110 transition-transform flex-shrink-0"
            >
              {deadline.status === 'completed' ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getTypeIcon()}</span>
                <h3 className="font-bold text-base truncate">{deadline.title}</h3>
              </div>
              
              {deadline.subjects && (
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: deadline.subjects.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {deadline.subjects.name}
                  </span>
                </div>
              )}

              {deadline.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {deadline.description}
                </p>
              )}

              <div className="flex items-center gap-3 text-sm">
                <span className={cn('font-bold flex items-center gap-1', getUrgencyColor())}>
                  {isOverdue ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  {getCountdownText()}
                </span>
                <span className="text-muted-foreground">
                  {format(dueDate, 'MMM dd, yyyy')}
                </span>
              </div>

              <div className="flex gap-2 mt-2">
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  deadline.priority === 'high' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
                  deadline.priority === 'medium' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                  deadline.priority === 'low' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                )}>
                  {deadline.priority.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                  {deadline.type}
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex-shrink-0">
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
                  className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border-2 border-gray-200 overflow-hidden z-10"
                >
                  <Link href={`/deadlines/${deadline.id}/edit`}>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

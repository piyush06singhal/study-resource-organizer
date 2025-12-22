'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle2, Circle, MoreVertical, Edit, Trash2, Play } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { deleteStudyPlan, updateStudyPlanStatus } from '@/lib/actions/study-plans'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface StudyPlanCardProps {
  plan: {
    id: string
    title: string
    description?: string
    planned_date: string
    start_time?: string
    end_time?: string
    estimated_minutes?: number
    status: string
    subjects?: { id: string; name: string; color: string } | null
    topics?: { id: string; name: string } | null
  }
  delay?: number
}

export function StudyPlanCard({ plan, delay = 0 }: StudyPlanCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const getStatusIcon = () => {
    switch (plan.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (plan.status) {
      case 'completed':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/10'
      case 'in_progress':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/10'
      case 'skipped':
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/10'
      default:
        return 'border-l-purple-500 bg-purple-50 dark:bg-purple-950/10'
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${plan.title}"?`)) {
      return
    }

    setIsDeleting(true)
    const result = await deleteStudyPlan(plan.id)
    
    if (result.error) {
      alert('Error deleting study plan: ' + result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true)
    await updateStudyPlanStatus(plan.id, newStatus)
    setIsUpdating(false)
    router.refresh()
  }

  const formatTime = (time?: string) => {
    if (!time) return ''
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="relative"
    >
      <Card className={cn(
        "p-4 hover:shadow-md transition-all duration-200 border-l-4 group",
        getStatusColor()
      )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => {
                const nextStatus = plan.status === 'planned' ? 'in_progress' : plan.status === 'in_progress' ? 'completed' : 'planned'
                handleStatusChange(nextStatus)
              }}
              disabled={isUpdating}
              className="mt-0.5 hover:scale-110 transition-transform flex-shrink-0"
            >
              {getStatusIcon()}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{plan.title}</h3>
              
              {plan.subjects && (
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: plan.subjects.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">
                    {plan.subjects.name}
                  </span>
                </div>
              )}
              
              {plan.topics && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {plan.topics.name}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                {plan.start_time && plan.end_time && (
                  <span className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">{formatTime(plan.start_time)} - {formatTime(plan.end_time)}</span>
                  </span>
                )}
                {plan.estimated_minutes && (
                  <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded whitespace-nowrap">
                    {plan.estimated_minutes} min
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
                >
                  <Link href={`/planner/${plan.id}/edit`}>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-950 text-red-600 flex items-center gap-2"
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

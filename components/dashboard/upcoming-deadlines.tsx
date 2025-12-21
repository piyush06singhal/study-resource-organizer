'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, AlertCircle, Calendar } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Deadline {
  id: string
  title: string
  type: string
  due_date: string
  priority: string
  status: string
  subjects: { name: string; color: string } | null
}

export function UpcomingDeadlines({ deadlines }: { deadlines: Deadline[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
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

  const getDaysUntil = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 0) return 'Overdue'
    return `${diffDays} days`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Upcoming Deadlines
            </CardTitle>
            <Link href="/deadlines">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deadlines.length > 0 ? (
              deadlines.map((deadline, index) => (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    'p-4 rounded-lg border-2 hover:shadow-md transition-all duration-200',
                    getPriorityColor(deadline.priority)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getTypeIcon(deadline.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 truncate">
                            {deadline.title}
                          </h4>
                          {deadline.subjects && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {deadline.subjects.name}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap',
                            deadline.priority === 'high' && 'bg-red-600 text-white',
                            deadline.priority === 'medium' && 'bg-yellow-600 text-white',
                            deadline.priority === 'low' && 'bg-blue-600 text-white'
                          )}
                        >
                          {getDaysUntil(deadline.due_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(deadline.due_date), 'MMM dd, yyyy')}</span>
                        <span>•</span>
                        <span className="capitalize">{deadline.type}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming deadlines</p>
                <p className="text-xs">You're all caught up!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CalendarViewProps {
  plans: Array<{
    id: string
    title: string
    planned_date: string
    status: string
    subjects?: { color: string } | null
  }>
}

export function CalendarView({ plans }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getPlansForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return plans.filter(p => p.planned_date === dateStr)
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayPlans = getPlansForDay(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isCurrentDay = isToday(day)

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={cn(
                'min-h-24 p-2 rounded-lg border-2 transition-colors',
                isCurrentMonth ? 'bg-background' : 'bg-muted/30',
                isCurrentDay && 'border-primary bg-primary/5',
                !isCurrentDay && 'border-transparent hover:border-primary/30'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  'text-sm font-medium',
                  !isCurrentMonth && 'text-muted-foreground',
                  isCurrentDay && 'text-primary font-bold'
                )}>
                  {format(day, 'd')}
                </span>
                {isCurrentMonth && (
                  <Link href={`/planner/new?date=${format(day, 'yyyy-MM-dd')}`}>
                    <button className="opacity-0 hover:opacity-100 transition-opacity">
                      <Plus className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </button>
                  </Link>
                )}
              </div>
              <div className="space-y-1">
                {dayPlans.slice(0, 2).map((plan) => (
                  <Link key={plan.id} href={`/planner/${plan.id}`}>
                    <div
                      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: plan.subjects?.color + '20',
                        borderLeft: `3px solid ${plan.subjects?.color || '#888'}`
                      }}
                    >
                      {plan.title}
                    </div>
                  </Link>
                ))}
                {dayPlans.length > 2 && (
                  <div className="text-xs text-muted-foreground pl-1">
                    +{dayPlans.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}

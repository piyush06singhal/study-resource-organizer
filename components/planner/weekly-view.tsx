'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isToday,
  addWeeks,
  subWeeks
} from 'date-fns'
import Link from 'next/link'
import { StudyPlanCard } from './study-plan-card'
import { cn } from '@/lib/utils'

interface WeeklyViewProps {
  plans: Array<{
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
  }>
}

export function WeeklyView({ plans }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getPlansForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return plans.filter(p => p.planned_date === dateStr)
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(new Date())}
          >
            This Week
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid md:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayPlans = getPlansForDay(day)
          const isCurrentDay = isToday(day)

          return (
            <div key={day.toISOString()} className="space-y-3">
              {/* Day Header */}
              <div className={cn(
                'p-3 rounded-lg text-center',
                isCurrentDay ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <div className="text-xs font-medium">
                  {format(day, 'EEE')}
                </div>
                <div className="text-2xl font-bold">
                  {format(day, 'd')}
                </div>
              </div>

              {/* Plans for the day */}
              <div className="space-y-2">
                {dayPlans.map((plan, index) => (
                  <StudyPlanCard key={plan.id} plan={plan} delay={index * 0.05} />
                ))}
                
                {/* Add button */}
                <Link href={`/planner/new?date=${format(day, 'yyyy-MM-dd')}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

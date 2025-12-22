'use client'

import { format, eachDayOfInterval, startOfYear, endOfYear, getDay } from 'date-fns'

interface HeatmapChartProps {
  data: Record<string, number>
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  const today = new Date()
  const yearStart = startOfYear(today)
  const days = eachDayOfInterval({ start: yearStart, end: today })

  const getColor = (minutes: number) => {
    if (minutes === 0) return 'bg-gray-100'
    if (minutes < 30) return 'bg-green-200'
    if (minutes < 60) return 'bg-green-300'
    if (minutes < 120) return 'bg-green-400'
    return 'bg-green-500'
  }

  // Group days by week
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  days.forEach((day, index) => {
    if (getDay(day) === 1 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
  })
  if (currentWeek.length > 0) weeks.push(currentWeek)

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const minutes = data[dateStr] || 0
              return (
                <div
                  key={dateStr}
                  className={`w-3 h-3 rounded-sm ${getColor(minutes)} hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                  title={`${dateStr}: ${minutes} minutes`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 rounded-sm" />
          <div className="w-3 h-3 bg-green-300 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface TimeOfDayHeatmapProps {
  data: Record<string, { count: number; totalMinutes: number }>
}

export function TimeOfDayHeatmap({ data }: TimeOfDayHeatmapProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // For now, we'll show a simplified version
  // In a real implementation, you'd need data grouped by day and hour
  const maxMinutes = Math.max(...Object.values(data).map(d => d.totalMinutes))

  const getColor = (minutes: number) => {
    if (minutes === 0) return 'bg-gray-100'
    const intensity = minutes / maxMinutes
    if (intensity < 0.25) return 'bg-blue-200'
    if (intensity < 0.5) return 'bg-blue-300'
    if (intensity < 0.75) return 'bg-blue-400'
    return 'bg-blue-500'
  }

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-600" />
        Study Time Heatmap by Day & Hour
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Visualize when you study most throughout the week
      </p>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 pt-8">
              {days.map((day) => (
                <div key={day} className="h-6 flex items-center text-xs font-medium text-gray-600">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex gap-1 mb-2">
                {hours.filter(h => h % 3 === 0).map((hour) => (
                  <div key={hour} className="text-xs text-gray-600 w-12 text-center">
                    {hour}:00
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {days.map((day) => {
                  const dayData = data[day] || { count: 0, totalMinutes: 0 }
                  return (
                    <div key={day} className="flex gap-1">
                      {hours.map((hour) => {
                        // Simplified: distribute day's minutes across active hours
                        const minutes = dayData.count > 0 ? dayData.totalMinutes / 24 : 0
                        return (
                          <div
                            key={hour}
                            className={`w-3 h-6 rounded-sm ${getColor(minutes)} hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                            title={`${day} ${hour}:00 - ${Math.round(minutes)}min`}
                          />
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm" />
              <div className="w-3 h-3 bg-blue-200 rounded-sm" />
              <div className="w-3 h-3 bg-blue-300 rounded-sm" />
              <div className="w-3 h-3 bg-blue-400 rounded-sm" />
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

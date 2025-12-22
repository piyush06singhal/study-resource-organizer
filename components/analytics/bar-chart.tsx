'use client'

interface BarChartProps {
  data: Record<string, { count: number; totalMinutes: number }>
}

export function BarChart({ data }: BarChartProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const maxMinutes = Math.max(...Object.values(data).map(d => d.totalMinutes))

  if (maxMinutes === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const dayData = data[day] || { count: 0, totalMinutes: 0 }
        const percentage = maxMinutes > 0 ? (dayData.totalMinutes / maxMinutes) * 100 : 0
        const hours = Math.floor(dayData.totalMinutes / 60)
        const minutes = dayData.totalMinutes % 60

        return (
          <div key={day} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium w-24">{day}</span>
              <span className="text-gray-600">
                {hours}h {minutes}m ({dayData.count} sessions)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

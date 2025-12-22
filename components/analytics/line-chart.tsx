'use client'

interface LineChartProps {
  data: Record<string, number>
}

export function LineChart({ data }: LineChartProps) {
  const entries = Object.entries(data)
  
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    )
  }

  const maxMinutes = Math.max(...entries.map(([_, minutes]) => minutes))
  const minMinutes = Math.min(...entries.map(([_, minutes]) => minutes))

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="relative h-64 flex items-end gap-2">
        {entries.map(([month, minutes], index) => {
          const height = maxMinutes > 0 ? ((minutes - minMinutes) / (maxMinutes - minMinutes || 1)) * 100 : 0
          const hours = Math.floor(minutes / 60)
          
          return (
            <div key={month} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer group relative"
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {hours}h {minutes % 60}m
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{month}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
        <div>
          <span className="font-semibold">Total: </span>
          {Math.floor(entries.reduce((acc, [_, m]) => acc + m, 0) / 60)}h
        </div>
        <div>
          <span className="font-semibold">Average: </span>
          {Math.floor(entries.reduce((acc, [_, m]) => acc + m, 0) / entries.length / 60)}h/month
        </div>
      </div>
    </div>
  )
}

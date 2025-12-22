'use client'

interface PieChartProps {
  data: Array<{ name: string; color: string; minutes: number }>
}

export function PieChart({ data }: PieChartProps) {
  const total = data.reduce((acc, item) => acc + item.minutes, 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = (item.minutes / total) * 100
        return (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-gray-600">
                {Math.floor(item.minutes / 60)}h {item.minutes % 60}m ({Math.round(percentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ProductivityChartProps {
  currentPeriodMinutes: number
  previousPeriodMinutes: number
  changePercentage: number
  trend: 'up' | 'down' | 'stable'
}

export function ProductivityChart({
  currentPeriodMinutes,
  previousPeriodMinutes,
  changePercentage,
  trend
}: ProductivityChartProps) {
  const currentHours = Math.floor(currentPeriodMinutes / 60)
  const previousHours = Math.floor(previousPeriodMinutes / 60)

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card className={`p-6 border-2 ${getTrendColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Productivity Trend</h3>
        {getTrendIcon()}
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Last 30 Days</p>
          <p className="text-3xl font-bold">{currentHours}h</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Previous 30 Days</p>
          <p className="text-2xl font-semibold text-gray-700">{previousHours}h</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-gray-400 h-2 rounded-full transition-all"
              style={{
                width: previousPeriodMinutes > 0
                  ? `${(previousPeriodMinutes / currentPeriodMinutes) * 100}%`
                  : '0%'
              }}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Change</span>
            <span className={`text-2xl font-bold ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {changePercentage > 0 ? '+' : ''}{changePercentage}%
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {trend === 'up' ? 'Great progress! Keep it up!' :
             trend === 'down' ? 'Try to increase your study time' :
             'Maintaining consistency'}
          </p>
        </div>
      </div>
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Brain, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

interface FocusScoreCardProps {
  score: number
  totalStudyMinutes: number
  completedPlans: number
  totalPlans: number
  avgSessionLength: number
  sessionsCount: number
}

export function FocusScoreCard({
  score,
  totalStudyMinutes,
  completedPlans,
  totalPlans,
  avgSessionLength,
  sessionsCount
}: FocusScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-blue-500 to-blue-600'
    if (score >= 40) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white shadow-sm">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Focus Score</h3>
          <p className="text-sm text-gray-600">Last 7 days</p>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="transform -rotate-90" width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(score / 100) * 439.6} 439.6`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`${getScoreGradient(score).split(' ')[0].replace('from-', 'text-')}`} stopColor="currentColor" />
                <stop offset="100%" className={`${getScoreGradient(score).split(' ')[1].replace('to-', 'text-')}`} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-gray-600 font-medium">
              {getScoreLabel(score)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-gray-600">Study Time</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-xs text-gray-600">Completed</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {completedPlans}/{totalPlans}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-xs text-gray-600">Avg Session</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {avgSessionLength}m
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-4 w-4 text-orange-600" />
            <span className="text-xs text-gray-600">Sessions</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {sessionsCount}
          </p>
        </div>
      </div>
    </Card>
  )
}

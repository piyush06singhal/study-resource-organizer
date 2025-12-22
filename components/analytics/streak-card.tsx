'use client'

import { Card } from '@/components/ui/card'
import { Flame, Trophy, Calendar } from 'lucide-react'

interface StreakCardProps {
  currentStreak: number
  longestStreak: number
  totalDays: number
}

export function StreakCard({ currentStreak, longestStreak, totalDays }: StreakCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white shadow-sm">
          <Flame className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Study Streak</h3>
          <p className="text-sm text-gray-600">Keep the momentum going!</p>
        </div>
      </div>

      {/* Current Streak */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg mb-3">
          <div className="flex flex-col items-center text-white">
            <Flame className="h-8 w-8 mb-1" />
            <span className="text-3xl font-bold">{currentStreak}</span>
            <span className="text-xs font-medium">days</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-700">
          {currentStreak === 0 ? 'Start your streak today!' :
           currentStreak === 1 ? 'Great start! Keep it up!' :
           currentStreak < 7 ? 'Building momentum!' :
           currentStreak < 30 ? 'Impressive consistency!' :
           'Amazing dedication!'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{longestStreak}</p>
          <p className="text-xs text-gray-600">Longest Streak</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
          <p className="text-xs text-gray-600">Total Study Days</p>
        </div>
      </div>

      {/* Motivation */}
      {currentStreak > 0 && (
        <div className="mt-4 p-3 bg-white rounded-lg text-center">
          <p className="text-sm text-gray-700">
            {longestStreak - currentStreak > 0 ? (
              <>Only <span className="font-bold text-orange-600">{longestStreak - currentStreak}</span> days to beat your record!</>
            ) : (
              <>You're on your <span className="font-bold text-orange-600">best streak</span> ever!</>
            )}
          </p>
        </div>
      )}
    </Card>
  )
}

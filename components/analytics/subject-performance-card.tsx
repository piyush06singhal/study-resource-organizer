'use client'

import { Card } from '@/components/ui/card'
import { BookOpen, TrendingUp, Clock } from 'lucide-react'

interface SubjectPerformance {
  id: string
  name: string
  color: string
  totalTopics: number
  completedTopics: number
  inProgressTopics: number
  notStartedTopics: number
  totalMinutes: number
  completionRate: number
}

interface SubjectPerformanceCardProps {
  subjects: SubjectPerformance[]
}

export function SubjectPerformanceCard({ subjects }: SubjectPerformanceCardProps) {
  if (subjects.length === 0) {
    return (
      <Card className="p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Subject Performance
        </h3>
        <div className="text-center py-8 text-gray-500">
          No subjects found. Add subjects to see performance metrics.
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-blue-600" />
        Subject Performance
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Track your progress across all subjects
      </p>
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: subject.color }}
                />
                <h4 className="font-semibold text-gray-900">{subject.name}</h4>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(subject.totalMinutes / 60)}h</span>
                </div>
                <div className={`font-bold ${
                  subject.completionRate >= 80 ? 'text-green-600' :
                  subject.completionRate >= 50 ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {subject.completionRate}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="h-2 flex">
                  {subject.completedTopics > 0 && (
                    <div
                      className="bg-green-500"
                      style={{ width: `${(subject.completedTopics / subject.totalTopics) * 100}%` }}
                      title={`Completed: ${subject.completedTopics}`}
                    />
                  )}
                  {subject.inProgressTopics > 0 && (
                    <div
                      className="bg-blue-500"
                      style={{ width: `${(subject.inProgressTopics / subject.totalTopics) * 100}%` }}
                      title={`In Progress: ${subject.inProgressTopics}`}
                    />
                  )}
                  {subject.notStartedTopics > 0 && (
                    <div
                      className="bg-gray-300"
                      style={{ width: `${(subject.notStartedTopics / subject.totalTopics) * 100}%` }}
                      title={`Not Started: ${subject.notStartedTopics}`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Topic Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>{subject.completedTopics} completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{subject.inProgressTopics} in progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span>{subject.notStartedTopics} not started</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

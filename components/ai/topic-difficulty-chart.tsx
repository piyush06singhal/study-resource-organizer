'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function TopicDifficultyChart({ difficulties }: { difficulties: any[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Topic Difficulty Analysis</h3>
      <p className="text-sm text-gray-600 mb-4">
        AI-predicted difficulty based on your study patterns
      </p>

      <div className="space-y-3">
        {difficulties.slice(0, 10).map((diff: any) => {
          const isHard = diff.difficulty_score > 70
          const isMedium = diff.difficulty_score > 40 && diff.difficulty_score <= 70
          
          return (
            <div key={diff.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {diff.topics?.subjects && (
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: diff.topics.subjects.color }}
                    />
                  )}
                  <span className="font-medium">{diff.topics?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {diff.confidence_level}% confidence
                  </span>
                  {isHard ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : isMedium ? (
                    <Minus className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isHard ? 'bg-red-500' : isMedium ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${diff.difficulty_score}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-12 text-right">
                  {diff.difficulty_score}%
                </span>
              </div>

              {diff.predicted_mastery_date && (
                <p className="text-xs text-gray-500">
                  Predicted mastery: {new Date(diff.predicted_mastery_date).toLocaleDateString()}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

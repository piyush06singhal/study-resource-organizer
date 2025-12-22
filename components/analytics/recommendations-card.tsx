'use client'

import { Card } from '@/components/ui/card'
import { Lightbulb, AlertCircle, TrendingUp, Target } from 'lucide-react'

interface Recommendation {
  type: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface RecommendationsCardProps {
  recommendations: Recommendation[]
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Target className="h-5 w-5" />
      case 'motivation':
        return <TrendingUp className="h-5 w-5" />
      case 'balance':
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  if (recommendations.length === 0) {
    return (
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-100">
            <Lightbulb className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">AI Recommendations</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Great job! You're on track with your studies.</p>
          <p className="text-sm mt-2">Keep up the good work!</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-100">
          <Lightbulb className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold">AI Recommendations</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Personalized insights to improve your study habits
      </p>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-gray-700">
                {getIcon(rec.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

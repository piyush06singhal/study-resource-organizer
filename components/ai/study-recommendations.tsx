'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { dismissRecommendation } from '@/lib/actions/ai'
import { Lightbulb, X, Clock, BookOpen, Coffee, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function StudyRecommendations({ recommendations }: { recommendations: any[] }) {
  const router = useRouter()

  const handleDismiss = async (id: string) => {
    await dismissRecommendation(id)
    router.refresh()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'topic': return <BookOpen className="w-5 h-5" />
      case 'time': return <Clock className="w-5 h-5" />
      case 'revision': return <TrendingUp className="w-5 h-5" />
      case 'break': return <Coffee className="w-5 h-5" />
      default: return <Lightbulb className="w-5 h-5" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'topic': return 'bg-blue-100 text-blue-700'
      case 'time': return 'bg-green-100 text-green-700'
      case 'revision': return 'bg-purple-100 text-purple-700'
      case 'break': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold">Smart Recommendations</h3>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-sm text-gray-500">No recommendations at the moment. Keep studying!</p>
        ) : (
          <div className="space-y-3">
            {recommendations.map(rec => (
              <div 
                key={rec.id}
                className={`p-4 rounded-lg ${getColor(rec.recommendation_type)} relative`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleDismiss(rec.id)}
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="flex items-start gap-3 pr-8">
                  {getIcon(rec.recommendation_type)}
                  <div>
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm mt-1">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

import { getAIStudyPlans, getStudyRecommendations, getTopicDifficulties } from '@/lib/actions/ai'
import { getDeadlines } from '@/lib/actions/deadlines'
import { AIStudyPlanGenerator } from '@/components/ai/ai-study-plan-generator'
import { StudyRecommendations } from '@/components/ai/study-recommendations'
import { TopicDifficultyChart } from '@/components/ai/topic-difficulty-chart'
import { AIStudyPlansList } from '@/components/ai/ai-study-plans-list'
import { Brain, Sparkles } from 'lucide-react'
import { Suspense } from 'react'

async function AIContent() {
  const [plans, recommendations, difficulties, deadlines] = await Promise.all([
    getAIStudyPlans(),
    getStudyRecommendations(),
    getTopicDifficulties(),
    getDeadlines()
  ])

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <AIStudyPlanGenerator deadlines={deadlines as any[]} />
        <StudyRecommendations recommendations={recommendations as any[]} />
      </div>

      {difficulties && (difficulties as any[]).length > 0 && (
        <TopicDifficultyChart difficulties={difficulties as any[]} />
      )}

      {plans && (plans as any[]).length > 0 && (
        <AIStudyPlansList plans={plans as any[]} />
      )}
    </>
  )
}

export default function AIPlanner() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Smart Study Planner
        </h1>
        <p className="text-gray-600 mt-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Automatically optimize your study schedule based on deadlines and preferences
        </p>
      </div>

      <Suspense fallback={
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading planner...</p>
        </div>
      }>
        <AIContent />
      </Suspense>
    </div>
  )
}

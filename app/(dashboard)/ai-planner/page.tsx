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
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          AI Study Planner
        </h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Let AI optimize your study schedule and provide personalized recommendations
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
        <AIContent />
      </Suspense>
    </div>
  )
}

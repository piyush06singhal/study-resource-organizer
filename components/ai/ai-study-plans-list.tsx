'use client'

import { Card } from '@/components/ui/card'
import { Calendar, Target, CheckCircle2 } from 'lucide-react'

export function AIStudyPlansList({ plans }: { plans: any[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Your AI Study Plans</h3>

      <div className="space-y-4">
        {plans.map(plan => (
          <div key={plan.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg">{plan.title}</h4>
                {plan.description && (
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                plan.status === 'active' ? 'bg-green-100 text-green-700' :
                plan.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {plan.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {plan.goals?.length || 0} goals
              </div>
            </div>

            {plan.goals && plan.goals.length > 0 && (
              <div className="space-y-1">
                {plan.goals.map((goal: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    {goal}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

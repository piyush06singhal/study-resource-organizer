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
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{plan.description}</p>
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
              <div className="space-y-1 mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Target Goals</span>
                {plan.goals.map((goal: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    {goal}
                  </div>
                ))}
              </div>
            )}

            {plan.generated_tasks && (plan.generated_tasks as any[]).length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Generated Tasks & Roadmap</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {(plan.generated_tasks as any[]).map((task: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-gray-800">{task.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold flex-shrink-0 ${
                            task.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-100' :
                            task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.suggested_dates && task.suggested_dates.length > 0 && (
                          <div className="text-[10px] text-gray-500 mt-1">
                            Scheduled: {task.suggested_dates.map((d: string) => new Date(d).toLocaleDateString()).join(', ')}
                          </div>
                        )}
                      </div>
                      {task.estimated_hours && (
                        <div className="text-[10px] font-medium text-gray-600 pt-1 border-t border-dashed border-gray-200">
                          Estimate: {task.estimated_hours} hours
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

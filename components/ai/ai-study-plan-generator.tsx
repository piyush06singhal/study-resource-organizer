'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateAIStudyPlan } from '@/lib/actions/ai'
import { Brain, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function AIStudyPlanGenerator({ deadlines }: { deadlines: any[] }) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [hoursPerDay, setHoursPerDay] = useState(3)
  const [goals, setGoals] = useState('')

  const handleGenerate = async () => {
    if (deadlines.length === 0) {
      alert('No upcoming deadlines found. Add some deadlines first!')
      return
    }

    setGenerating(true)
    try {
      await generateAIStudyPlan({
        deadlines,
        availableHoursPerDay: hoursPerDay,
        preferredStudyTimes: ['morning', 'afternoon'],
        goals: goals.split('\n').filter(g => g.trim())
      })
      router.refresh()
      alert('AI Study Plan generated successfully!')
    } catch (error) {
      console.error(error)
      alert('Failed to generate study plan')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold">Generate AI Study Plan</h3>
        </div>

        <p className="text-sm text-gray-600">
          Let AI create an optimized study schedule based on your deadlines and preferences
        </p>

        <div className="space-y-3">
          <div>
            <Label htmlFor="hours">Available Hours Per Day</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="12"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="goals">Your Goals (one per line)</Label>
            <textarea
              id="goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="Pass all exams&#10;Master difficult topics&#10;Maintain good grades"
              className="w-full p-2 border rounded-lg min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={generating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {generating ? 'Generating...' : 'Generate AI Plan'}
          </Button>

          <p className="text-xs text-gray-500">
            Found {deadlines.length} upcoming deadlines to optimize
          </p>
        </div>
      </div>
    </Card>
  )
}

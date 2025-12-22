'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Loader2, Calendar } from 'lucide-react'
import { createStudyPlan, updateStudyPlan } from '@/lib/actions/study-plans'
import { useRouter } from 'next/navigation'

interface StudyPlanFormProps {
  plan?: {
    id: string
    title: string
    description?: string
    planned_date: string
    start_time?: string
    end_time?: string
    estimated_minutes?: number
    subject_id?: string
    topic_id?: string
    status: string
  }
  subjects?: Array<{ id: string; name: string; color: string }>
  topics?: Array<{ id: string; name: string; subject_id: string }>
  defaultDate?: string
  defaultSubjectId?: string
  defaultTopicId?: string
}

export function StudyPlanForm({ 
  plan, 
  subjects = [], 
  topics = [],
  defaultDate,
  defaultSubjectId,
  defaultTopicId
}: StudyPlanFormProps) {
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    description: plan?.description || '',
    planned_date: plan?.planned_date || defaultDate || new Date().toISOString().split('T')[0],
    start_time: plan?.start_time || '',
    end_time: plan?.end_time || '',
    estimated_minutes: plan?.estimated_minutes || 60,
    subject_id: plan?.subject_id || defaultSubjectId || '',
    topic_id: plan?.topic_id || defaultTopicId || '',
    status: plan?.status || 'planned'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Filter topics by selected subject
  const filteredTopics = formData.subject_id
    ? topics.filter(t => t.subject_id === formData.subject_id)
    : topics

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const result = plan
      ? await updateStudyPlan(plan.id, formData)
      : await createStudyPlan(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/planner')
      router.refresh()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 md:p-8 w-full bg-white">
        <div className="mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            {plan ? 'Edit Study Plan' : 'Create Study Plan'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {plan ? 'Update your study plan' : 'Schedule a new study session'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Study Operating Systems"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="h-12 bg-white"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <select
                id="subject"
                value={formData.subject_id}
                onChange={(e) => setFormData({ ...formData, subject_id: e.target.value, topic_id: '' })}
                className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">No subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <select
                id="topic"
                value={formData.topic_id}
                onChange={(e) => setFormData({ ...formData, topic_id: e.target.value })}
                disabled={!formData.subject_id}
                className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">No topic</option>
                {filteredTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planned_date">Date *</Label>
            <Input
              id="planned_date"
              type="date"
              value={formData.planned_date}
              onChange={(e) => setFormData({ ...formData, planned_date: e.target.value })}
              required
              className="h-12 bg-white"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="h-12 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="h-12 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_minutes">Duration (min)</Label>
              <Input
                id="estimated_minutes"
                type="number"
                min="1"
                value={formData.estimated_minutes}
                onChange={(e) => setFormData({ ...formData, estimated_minutes: parseInt(e.target.value) })}
                className="h-12 bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="What will you study?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {plan ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                plan ? 'Update Plan' : 'Create Plan'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}

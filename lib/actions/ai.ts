'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// AI Study Plan Generator
export async function generateAIStudyPlan(data: {
  deadlines: Array<{ id: string; title: string; due_date: string; subject_id: string }>
  availableHoursPerDay: number
  preferredStudyTimes: string[]
  goals: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Calculate study plan based on deadlines
  const tasks = data.deadlines.map((deadline, index) => {
    const daysUntil = Math.ceil(
      (new Date(deadline.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    const hoursNeeded = Math.max(daysUntil * 0.5, 2) // Minimum 2 hours per deadline
    
    return {
      deadline_id: deadline.id,
      title: `Study for ${deadline.title}`,
      subject_id: deadline.subject_id,
      estimated_hours: hoursNeeded,
      priority: daysUntil <= 7 ? 'high' : daysUntil <= 14 ? 'medium' : 'low',
      suggested_dates: generateStudyDates(daysUntil, hoursNeeded, data.availableHoursPerDay)
    }
  })

  const { data: plan, error } = await supabase
    .from('ai_study_plans')
    .insert({
      user_id: user.id,
      title: 'AI Generated Study Plan',
      description: 'Automatically generated based on your deadlines and preferences',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      goals: data.goals,
      generated_tasks: tasks,
      status: 'active'
    } as any)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/ai-planner')
  return plan
}

function generateStudyDates(daysUntil: number, totalHours: number, hoursPerDay: number) {
  const dates = []
  const sessionsNeeded = Math.ceil(totalHours / hoursPerDay)
  const daysBetweenSessions = Math.floor(daysUntil / sessionsNeeded)
  
  for (let i = 0; i < sessionsNeeded; i++) {
    const date = new Date(Date.now() + (i * daysBetweenSessions * 24 * 60 * 60 * 1000))
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// Smart Revision Scheduling (Spaced Repetition)
export async function scheduleSmartRevision(topicId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get topic difficulty data
  const { data: difficulty } = await supabase
    .from('topic_difficulty')
    .select('*')
    .eq('topic_id', topicId)
    .eq('user_id', user.id)
    .single()

  const confidenceLevel = (difficulty as any)?.confidence_level || 50
  const revisionCount = (difficulty as any)?.revision_count || 0

  // Calculate next revision date using spaced repetition
  const intervals = [1, 3, 7, 14, 30, 60, 90] // days
  const intervalIndex = Math.min(revisionCount, intervals.length - 1)
  const daysUntilNext = intervals[intervalIndex]
  
  // Adjust based on confidence
  const adjustedDays = confidenceLevel < 50 
    ? Math.floor(daysUntilNext * 0.7) 
    : daysUntilNext

  const nextRevisionDate = new Date(Date.now() + adjustedDays * 24 * 60 * 60 * 1000)

  // Create revision entry
  const { data, error } = await supabase
    .from('revisions')
    .insert({
      user_id: user.id,
      topic_id: topicId,
      revision_number: revisionCount + 1,
      revision_date: new Date().toISOString().split('T')[0],
      next_revision_date: nextRevisionDate.toISOString().split('T')[0],
      confidence_level: confidenceLevel
    } as any)
    .select()
    .single()

  if (error) throw error

  // Update topic difficulty
  await supabase
    .from('topic_difficulty')
    .upsert({
      user_id: user.id,
      topic_id: topicId,
      revision_count: revisionCount + 1,
      last_reviewed: new Date().toISOString().split('T')[0]
    } as any)

  revalidatePath('/topics')
  return data
}

// Topic Difficulty Prediction
export async function predictTopicDifficulty(topicId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get study sessions for this topic
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('topic_id', topicId)
    .eq('user_id', user.id)

  // Get revisions for this topic
  const { data: revisions } = await supabase
    .from('revisions')
    .select('*')
    .eq('topic_id', topicId)
    .eq('user_id', user.id)

  const totalTime = (sessions as any[])?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0
  const avgConfidence = (revisions as any[])?.reduce((sum, r) => sum + (r.confidence_level || 0), 0) / ((revisions as any[])?.length || 1) || 50
  const revisionCount = (revisions as any[])?.length || 0

  // Calculate difficulty score (0-100, higher = more difficult)
  let difficultyScore = 50 // baseline
  
  // More time spent = potentially more difficult
  if (totalTime > 300) difficultyScore += 20
  else if (totalTime > 180) difficultyScore += 10
  
  // Lower confidence = more difficult
  if (avgConfidence < 40) difficultyScore += 20
  else if (avgConfidence < 60) difficultyScore += 10
  else if (avgConfidence > 80) difficultyScore -= 20
  
  // More revisions needed = more difficult
  if (revisionCount > 5) difficultyScore += 15
  else if (revisionCount > 3) difficultyScore += 10
  
  difficultyScore = Math.max(0, Math.min(100, difficultyScore))

  // Predict mastery date
  const hoursNeeded = Math.ceil((100 - avgConfidence) / 10) * 2
  const daysNeeded = Math.ceil(hoursNeeded / 2)
  const masteryDate = new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000)

  // Update or insert difficulty data
  const { data, error } = await (supabase
    .from('topic_difficulty') as any)
    .upsert({
      user_id: user.id,
      topic_id: topicId,
      difficulty_score: difficultyScore,
      confidence_level: avgConfidence,
      time_spent_minutes: totalTime,
      revision_count: revisionCount,
      predicted_mastery_date: masteryDate.toISOString().split('T')[0]
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Personalized Study Recommendations
export async function generateStudyRecommendations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const recommendations = []

  // Get topics with low confidence
  const { data: difficultTopics } = await supabase
    .from('topic_difficulty')
    .select('*, topics(name, subjects(name, color))')
    .eq('user_id', user.id)
    .lt('confidence_level', 60)
    .order('confidence_level', { ascending: true })
    .limit(3)

  if (difficultTopics && (difficultTopics as any[]).length > 0) {
    (difficultTopics as any[]).forEach((topic: any) => {
      recommendations.push({
        user_id: user.id,
        recommendation_type: 'topic',
        title: `Focus on ${topic.topics?.name}`,
        description: `This topic needs more attention. Current confidence: ${topic.confidence_level}%`,
        priority: 100 - topic.confidence_level,
        metadata: { topic_id: topic.topic_id, confidence: topic.confidence_level }
      })
    })
  }

  // Get upcoming deadlines
  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .gte('due_date', new Date().toISOString().split('T')[0])
    .lte('due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

  if (deadlines && (deadlines as any[]).length > 0) {
    (deadlines as any[]).forEach((deadline: any) => {
      const daysUntil = Math.ceil((new Date(deadline.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      recommendations.push({
        user_id: user.id,
        recommendation_type: 'revision',
        title: `Prepare for ${deadline.title}`,
        description: `Due in ${daysUntil} days. Start preparing now!`,
        priority: 100 - daysUntil * 10,
        metadata: { deadline_id: deadline.id, days_until: daysUntil }
      })
    })
  }

  // Check for study breaks
  const { data: recentSessions } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('start_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('start_time', { ascending: false })

  const totalStudyTime = (recentSessions as any[])?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0
  
  if (totalStudyTime > 300) {
    recommendations.push({
      user_id: user.id,
      recommendation_type: 'break',
      title: 'Take a Break',
      description: `You've studied for ${Math.floor(totalStudyTime / 60)} hours today. Consider taking a break!`,
      priority: 70,
      metadata: { study_time: totalStudyTime }
    })
  }

  // Insert recommendations
  if (recommendations.length > 0) {
    await supabase
      .from('study_recommendations')
      .insert(recommendations as any)
  }

  revalidatePath('/dashboard')
  return recommendations
}

// Get AI Study Plans
export async function getAIStudyPlans() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('ai_study_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Get Study Recommendations
export async function getStudyRecommendations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('study_recommendations')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_dismissed', false)
    .order('priority', { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

// Dismiss Recommendation
export async function dismissRecommendation(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: any = { is_dismissed: true }
  const { error } = await (supabase
    .from('study_recommendations') as any)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/dashboard')
}

// Get Topic Difficulty Data
export async function getTopicDifficulties() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('topic_difficulty')
    .select('*, topics(name, subjects(name, color))')
    .eq('user_id', user.id)
    .order('difficulty_score', { ascending: false })

  if (error) throw error
  return data
}

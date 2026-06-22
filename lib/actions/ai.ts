'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// AI Study Plan Generator
export async function generateAIStudyPlan(data: {
  deadlines: { id: string; title: string; due_date: string; subject_id: string }[]
  availableHoursPerDay: number
  preferredStudyTimes: string[]
  goals: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let tasks: any[] = []
  let description = 'Automatically generated based on your deadlines and preferences'

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (apiKey) {
    try {
      const prompt = `You are a Smart Study Planner AI integrated into a "Study Resource Organizer" application.
The application includes features for managing subjects, topics, study sessions, spaced repetition revisions, deadlines, markdown notes, and flashcards.

Your task is to analyze the student's goals and deadlines, and generate a customized study plan.

STUDENT PROFILE & INPUTS:
- Goals: ${JSON.stringify(data.goals)}
- Deadlines: ${JSON.stringify(
        data.deadlines.map((d: any) => ({
          id: d.id,
          title: d.title,
          due_date: d.due_date,
          subject_id: d.subject_id,
        }))
      )}
- Available Study Hours Per Day: ${data.availableHoursPerDay}
- Preferred Study Times: ${JSON.stringify(data.preferredStudyTimes)}
- Current Date: ${new Date().toISOString().split('T')[0]}

Generate a highly specific, realistic, and actionable study plan. It should provide a clear strategic roadmap of how to approach their long-term goals (like UPSC, board exams, or master difficult topics) and align it with their upcoming deadlines.

Return a JSON object matching this schema:
{
  "roadmap": "A detailed, motivating, and personalized study roadmap and strategic advice (in plain text, using paragraphs and clean bullet points for easy reading) specifically tailored to the student's goals and deadlines. Break down the plan into clear weekly or phase-based milestones.",
  "tasks": [
    {
      "deadline_id": "string (optional, match the id of the deadline this task helps prepare for)",
      "title": "string (specific, actionable task title, e.g., 'Study Ancient History for UPSC' or 'Practice past papers for Math Board Exam')",
      "subject_id": "string (optional, match the subject_id of the deadline)",
      "estimated_hours": number,
      "priority": "high" | "medium" | "low",
      "suggested_dates": ["YYYY-MM-DD"]
    }
  ]
}

Response MUST be valid JSON only. DO NOT wrap the output in markdown code blocks like \`\`\`json.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      )

      if (response.ok) {
        const json = await response.json()
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          const result = JSON.parse(text.trim())
          if (result.roadmap) {
            description = result.roadmap
          }
          if (Array.isArray(result.tasks)) {
            tasks = result.tasks
          }
        }
      }
    } catch (e) {
      console.error('Failed to generate study plan using Gemini:', e)
    }
  }

  // Fallback to heuristic generation if Gemini API is not configured or failed
  if (tasks.length === 0) {
    tasks = data.deadlines.map((deadline) => {
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
  }

  const { data: plan, error } = await supabase
    .from('ai_study_plans')
    .insert({
      user_id: user.id,
      title: 'AI Generated Study Plan',
      description,
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

  let recommendations: any[] = []

  // 1. Get difficult topics
  const { data: difficultTopics } = await supabase
    .from('topic_difficulty')
    .select('*, topics(name, subjects(name, color))')
    .eq('user_id', user.id)

  // 2. Get upcoming deadlines
  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('*, subjects(name)')
    .eq('user_id', user.id)
    .eq('status', 'pending')

  // 3. Get recent sessions (last 7 days)
  const { data: recentSessions } = await supabase
    .from('study_sessions')
    .select('*, subjects(name), topics(name)')
    .eq('user_id', user.id)
    .gte('start_time', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (apiKey) {
    try {
      const prompt = `You are a Smart Study Coach AI integrated into a "Study Resource Organizer" application.
The application helps students manage academic subjects, topics, deadlines, study logs, spaced repetition reviews, and flashcards.

Your task is to analyze the student's current learning status and generate 2-4 highly realistic, personalized, and actionable study recommendations.

STUDENT PROFILE & CURRENT STATUS:
1. Difficulty & Confidence Levels:
${JSON.stringify(
  difficultTopics?.map((t: any) => ({
    topic: t.topics?.name,
    subject: t.topics?.subjects?.name,
    confidence_level: t.confidence_level,
    difficulty_score: t.difficulty_score,
    time_spent_minutes: t.time_spent_minutes,
    revision_count: t.revision_count
  }))
)}
2. Pending Upcoming Deadlines:
${JSON.stringify(
  deadlines?.map((d: any) => ({
    title: d.title,
    type: d.type,
    due_date: d.due_date,
    priority: d.priority,
    subject: d.subjects?.name
  }))
)}
3. Recent Study Sessions (last 7 days):
${JSON.stringify(
  recentSessions?.map((s: any) => ({
    subject: s.subjects?.name,
    topic: s.topics?.name,
    duration_minutes: s.duration_minutes,
    notes: s.notes
  }))
)}

Provide specific recommendations. Instead of generic advice, address their actual topics, deadlines, or study patterns.
For example, if they have an exam due in 3 days, recommend a revision. If they spent a lot of time on a topic but confidence is low, recommend a focused session. If they have studied a lot recently, recommend a break.

Return a JSON object containing a "recommendations" array where each object has:
- "recommendation_type": "topic" | "time" | "revision" | "break"
- "title": (string) A concise, motivating recommendation title.
- "description": (string) Actionable advice explaining why and what they should do.
- "priority": (number from 1 to 100) Recommendation priority.

Response MUST be valid JSON only. DO NOT wrap the output in markdown code blocks like \`\`\`json.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      )

      if (response.ok) {
        const json = await response.json()
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          const result = JSON.parse(text.trim())
          if (Array.isArray(result.recommendations)) {
            recommendations = result.recommendations.map((rec: any) => ({
              user_id: user.id,
              recommendation_type: rec.recommendation_type || 'topic',
              title: rec.title,
              description: rec.description,
              priority: rec.priority || 50,
              metadata: rec.metadata || {}
            }))
          }
        }
      }
    } catch (e) {
      console.error('Failed to generate study recommendations using Gemini:', e)
    }
  }

  // Fallback to local heuristic recommendations if Gemini failed or is not configured
  if (recommendations.length === 0) {
    // Get topics with low confidence
    const { data: diffTopics } = await supabase
      .from('topic_difficulty')
      .select('*, topics(name, subjects(name, color))')
      .eq('user_id', user.id)
      .lt('confidence_level', 60)
      .order('confidence_level', { ascending: true })
      .limit(3)

    if (diffTopics && (diffTopics as any[]).length > 0) {
      (diffTopics as any[]).forEach((topic: any) => {
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
    const { data: upcomingDeadlines } = await supabase
      .from('deadlines')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .gte('due_date', new Date().toISOString().split('T')[0])
      .lte('due_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

    if (upcomingDeadlines && (upcomingDeadlines as any[]).length > 0) {
      (upcomingDeadlines as any[]).forEach((deadline: any) => {
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
    const { data: recentSess } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('start_time', { ascending: false })

    const totalStudyTime = (recentSess as any[])?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0
    
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

  // If there are no active undismissed recommendations, generate them fresh
  const { data: existing } = await supabase
    .from('study_recommendations')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_dismissed', false)

  if (!existing || existing.length === 0) {
    await generateStudyRecommendations()
  }

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

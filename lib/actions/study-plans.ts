'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function getStudyPlans(filters?: {
  date?: string
  week?: string
  month?: string
  subject_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('study_plans')
    .select(`
      id,
      title,
      description,
      planned_date,
      start_time,
      end_time,
      estimated_minutes,
      status,
      created_at,
      subject_id,
      topic_id,
      subjects (id, name, color),
      topics (id, name)
    `)
    .eq('user_id', user.id)

  // Apply filters
  if (filters?.date) {
    query = query.eq('planned_date', filters.date)
  }

  if (filters?.week) {
    const weekStart = startOfWeek(new Date(filters.week), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(filters.week), { weekStartsOn: 1 })
    query = query
      .gte('planned_date', weekStart.toISOString().split('T')[0])
      .lte('planned_date', weekEnd.toISOString().split('T')[0])
  }

  if (filters?.month) {
    const monthStart = startOfMonth(new Date(filters.month))
    const monthEnd = endOfMonth(new Date(filters.month))
    query = query
      .gte('planned_date', monthStart.toISOString().split('T')[0])
      .lte('planned_date', monthEnd.toISOString().split('T')[0])
  }

  if (filters?.subject_id) {
    query = query.eq('subject_id', filters.subject_id)
  }

  const { data: plans, error } = await query.order('planned_date', { ascending: true }).order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching study plans:', error)
    return []
  }

  return plans || []
}

export async function getStudyPlanById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: plan, error } = await supabase
    .from('study_plans')
    .select(`
      *,
      subjects (id, name, color),
      topics (id, name)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching study plan:', error)
    return null
  }

  return plan
}

export async function createStudyPlan(formData: {
  title: string
  description?: string
  planned_date: string
  start_time?: string
  end_time?: string
  estimated_minutes?: number
  subject_id?: string
  topic_id?: string
  status?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('study_plans')
    .insert({
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      planned_date: formData.planned_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      estimated_minutes: formData.estimated_minutes,
      subject_id: formData.subject_id,
      topic_id: formData.topic_id,
      status: formData.status || 'planned'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating study plan:', error)
    return { error: error.message }
  }

  revalidatePath('/planner')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateStudyPlan(id: string, formData: {
  title: string
  description?: string
  planned_date: string
  start_time?: string
  end_time?: string
  estimated_minutes?: number
  subject_id?: string
  topic_id?: string
  status?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('study_plans')
    .update({
      title: formData.title,
      description: formData.description,
      planned_date: formData.planned_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      estimated_minutes: formData.estimated_minutes,
      subject_id: formData.subject_id,
      topic_id: formData.topic_id,
      status: formData.status
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating study plan:', error)
    return { error: error.message }
  }

  revalidatePath('/planner')
  revalidatePath(`/planner/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateStudyPlanStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('study_plans')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating study plan status:', error)
    return { error: error.message }
  }

  revalidatePath('/planner')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function deleteStudyPlan(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('study_plans')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting study plan:', error)
    return { error: error.message }
  }

  revalidatePath('/planner')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getWeeklyStats(weekStart: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { totalPlans: 0, completedPlans: 0, totalMinutes: 0 }
  }

  const weekEnd = endOfWeek(new Date(weekStart), { weekStartsOn: 1 }).toISOString().split('T')[0]

  const { data: plans } = await supabase
    .from('study_plans')
    .select('status, estimated_minutes')
    .eq('user_id', user.id)
    .gte('planned_date', weekStart)
    .lte('planned_date', weekEnd)

  const totalPlans = plans?.length || 0
  const completedPlans = plans?.filter(p => p.status === 'completed').length || 0
  const totalMinutes = plans?.reduce((acc, p) => acc + (p.estimated_minutes || 0), 0) || 0

  return { totalPlans, completedPlans, totalMinutes }
}

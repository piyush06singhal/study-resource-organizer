'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns'

export async function getStudySessions(filters?: {
  subject_id?: string
  date?: string
  week?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('study_sessions')
    .select(`
      id,
      start_time,
      end_time,
      duration_minutes,
      notes,
      created_at,
      subject_id,
      topic_id,
      subjects (id, name, color),
      topics (id, name)
    `)
    .eq('user_id', user.id)

  if (filters?.subject_id) {
    query = query.eq('subject_id', filters.subject_id)
  }

  if (filters?.date) {
    const dayStart = startOfDay(new Date(filters.date))
    const dayEnd = endOfDay(new Date(filters.date))
    query = query
      .gte('start_time', dayStart.toISOString())
      .lte('start_time', dayEnd.toISOString())
  }

  if (filters?.week) {
    const weekStart = startOfWeek(new Date(filters.week), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(filters.week), { weekStartsOn: 1 })
    query = query
      .gte('start_time', weekStart.toISOString())
      .lte('start_time', weekEnd.toISOString())
  }

  const { data: sessions, error } = await query.order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching study sessions:', error)
    return []
  }

  return sessions || []
}

export async function startStudySession(data: {
  subject_id?: string
  topic_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: session, error } = await supabase
    .from('study_sessions')
    // @ts-expect-error - Supabase type inference issue
    .insert({
      user_id: user.id,
      subject_id: data.subject_id,
      topic_id: data.topic_id,
      start_time: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error starting session:', error)
    return { error: error.message }
  }

  revalidatePath('/sessions')
  return { success: true, data: session }
}

export async function endStudySession(sessionId: string, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get session to calculate duration
  const { data: session } = await supabase
    .from('study_sessions')
    .select('start_time')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return { error: 'Session not found' }
  }

  const endTime = new Date()
  const startTime = new Date((session as { start_time: string }).start_time)
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

  const { data, error } = await supabase
    .from('study_sessions')
    // @ts-expect-error - Supabase type inference issue
    .update({
      end_time: endTime.toISOString(),
      duration_minutes: durationMinutes,
      notes
    })
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error ending session:', error)
    return { error: error.message }
  }

  revalidatePath('/sessions')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function getActiveSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: session } = await supabase
    .from('study_sessions')
    .select(`
      id,
      start_time,
      subject_id,
      topic_id,
      subjects (id, name, color),
      topics (id, name)
    `)
    .eq('user_id', user.id)
    .is('end_time', null)
    .order('start_time', { ascending: false })
    .limit(1)
    .single()

  return session
}

export async function getSessionStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { today: 0, week: 0, total: 0 }
  }

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  // Today's sessions
  const { data: todaySessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)
    .gte('start_time', startOfDay(today).toISOString())
    .lte('start_time', endOfDay(today).toISOString())

  // This week's sessions
  const { data: weekSessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)
    .gte('start_time', weekStart.toISOString())

  // All sessions
  const { data: allSessions } = await supabase
    .from('study_sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)

  type SessionStats = { duration_minutes: number | null }[]
  const todayMinutes = (todaySessions as SessionStats)?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0
  const weekMinutes = (weekSessions as SessionStats)?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0
  const totalMinutes = (allSessions as SessionStats)?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0

  return {
    today: todayMinutes,
    week: weekMinutes,
    total: totalMinutes
  }
}

export async function deleteSession(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting session:', error)
    return { error: error.message }
  }

  revalidatePath('/sessions')
  revalidatePath('/dashboard')
  return { success: true }
}

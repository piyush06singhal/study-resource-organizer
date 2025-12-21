'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek, subWeeks, format, eachDayOfInterval } from 'date-fns'

export async function getAnalyticsData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: sessionsBySubject } = await supabase
    .from('study_sessions')
    .select(`
      duration_minutes,
      subjects (name, color)
    `)
    .eq('user_id', user.id)
    .gte('start_time', thirtyDaysAgo.toISOString())
    .not('duration_minutes', 'is', null)

  const weeklyData = []
  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
    
    const { data: weekSessions } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .gte('start_time', weekStart.toISOString())
      .lte('start_time', weekEnd.toISOString())
      .not('duration_minutes', 'is', null)

    const totalMinutes = weekSessions?.reduce((acc, s: any) => acc + (s.duration_minutes || 0), 0) || 0
    
    weeklyData.push({
      week: format(weekStart, 'MMM dd'),
      minutes: totalMinutes,
      hours: Math.round((totalMinutes / 60) * 10) / 10
    })
  }

  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  
  const days = eachDayOfInterval({
    start: fourteenDaysAgo,
    end: new Date()
  })

  const dailyConsistency = await Promise.all(
    days.map(async (day) => {
      const dayStart = new Date(day)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(day)
      dayEnd.setHours(23, 59, 59, 999)

      const { data: daySessions } = await supabase
        .from('study_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('start_time', dayStart.toISOString())
        .lte('start_time', dayEnd.toISOString())
        .not('duration_minutes', 'is', null)

      const totalMinutes = daySessions?.reduce((acc, s: any) => acc + (s.duration_minutes || 0), 0) || 0
      
      return {
        date: format(day, 'MMM dd'),
        minutes: totalMinutes,
        studied: totalMinutes > 0
      }
    })
  )

  const { data: topicProgress } = await supabase
    .from('topics')
    .select(`
      status,
      subjects (name, color)
    `)
    .eq('user_id', user.id)

  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('status, due_date, created_at')
    .eq('user_id', user.id)

  const subjectTimeMap = new Map()
  sessionsBySubject?.forEach((session: any) => {
    const subjectName = session.subjects?.name || 'No Subject'
    const color = session.subjects?.color || '#6b7280'
    const existing = subjectTimeMap.get(subjectName) || { name: subjectName, minutes: 0, color }
    existing.minutes += session.duration_minutes || 0
    subjectTimeMap.set(subjectName, existing)
  })

  const subjectTimeData = Array.from(subjectTimeMap.values())
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 6)

  const topicStatusMap = new Map()
  topicProgress?.forEach((topic: any) => {
    const subjectName = topic.subjects?.name || 'No Subject'
    const existing = topicStatusMap.get(subjectName) || {
      name: subjectName,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      total: 0
    }
    
    existing.total++
    if (topic.status === 'completed') existing.completed++
    else if (topic.status === 'in_progress') existing.inProgress++
    else existing.notStarted++
    
    topicStatusMap.set(subjectName, existing)
  })

  const completionData = Array.from(topicStatusMap.values())

  const totalDeadlines = deadlines?.length || 0
  const completedOnTime = deadlines?.filter(d => 
    d.status === 'completed' && new Date(d.due_date) >= new Date()
  ).length || 0
  const overdue = deadlines?.filter(d => 
    d.status === 'pending' && new Date(d.due_date) < new Date()
  ).length || 0

  return {
    subjectTimeData,
    weeklyData,
    dailyConsistency,
    completionData,
    deadlineStats: {
      total: totalDeadlines,
      completedOnTime,
      overdue,
      adherenceRate: totalDeadlines > 0 ? Math.round((completedOnTime / totalDeadlines) * 100) : 0
    }
  }
}

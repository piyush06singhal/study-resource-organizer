'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format, subDays, subMonths } from 'date-fns'

export async function getStudyTimeHeatmap(days: number = 365) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const startDate = subDays(new Date(), days)

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('start_time, duration_minutes')
    .eq('user_id', user.id)
    .gte('start_time', startDate.toISOString())

  // Group by date
  const heatmapData: Record<string, number> = {}
  
  sessions?.forEach((session: any) => {
    const date = format(new Date(session.start_time), 'yyyy-MM-dd')
    heatmapData[date] = (heatmapData[date] || 0) + (session.duration_minutes || 0)
  })

  return heatmapData
}

export async function getSubjectTimeDistribution(months: number = 3) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const startDate = subMonths(new Date(), months)

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select(`
      duration_minutes,
      subjects (id, name, color)
    `)
    .eq('user_id', user.id)
    .gte('start_time', startDate.toISOString())

  // Group by subject
  const distribution: Record<string, { name: string; color: string; minutes: number }> = {}

  sessions?.forEach((session: any) => {
    if (session.subjects) {
      const subjectId = session.subjects.id
      if (!distribution[subjectId]) {
        distribution[subjectId] = {
          name: session.subjects.name,
          color: session.subjects.color,
          minutes: 0
        }
      }
      distribution[subjectId].minutes += session.duration_minutes || 0
    }
  })

  return Object.values(distribution)
}

export async function getWeeklyStudyPattern() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const startDate = subMonths(new Date(), 3)

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('start_time, duration_minutes')
    .eq('user_id', user.id)
    .gte('start_time', startDate.toISOString())

  // Group by day of week
  const pattern: Record<string, { count: number; totalMinutes: number }> = {
    'Monday': { count: 0, totalMinutes: 0 },
    'Tuesday': { count: 0, totalMinutes: 0 },
    'Wednesday': { count: 0, totalMinutes: 0 },
    'Thursday': { count: 0, totalMinutes: 0 },
    'Friday': { count: 0, totalMinutes: 0 },
    'Saturday': { count: 0, totalMinutes: 0 },
    'Sunday': { count: 0, totalMinutes: 0 }
  }

  sessions?.forEach((session: any) => {
    const dayName = format(new Date(session.start_time), 'EEEE')
    pattern[dayName].count++
    pattern[dayName].totalMinutes += session.duration_minutes || 0
  })

  return pattern
}

export async function getProductivityTrends() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const last30Days = subDays(new Date(), 30)
  const last60Days = subDays(new Date(), 60)

  const [currentPeriod, previousPeriod] = await Promise.all([
    supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .gte('start_time', last30Days.toISOString()),
    supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .gte('start_time', last60Days.toISOString())
      .lt('start_time', last30Days.toISOString())
  ])

  const currentTotal = currentPeriod.data?.reduce((acc, s: any) => acc + (s.duration_minutes || 0), 0) || 0
  const previousTotal = previousPeriod.data?.reduce((acc, s: any) => acc + (s.duration_minutes || 0), 0) || 0

  const change = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

  return {
    currentPeriodMinutes: currentTotal,
    previousPeriodMinutes: previousTotal,
    changePercentage: Math.round(change),
    trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
  }
}

export async function getBestStudyTimes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('start_time, duration_minutes')
    .eq('user_id', user.id)
    .gte('start_time', subMonths(new Date(), 3).toISOString())

  // Group by hour of day
  const hourlyData: Record<number, { count: number; totalMinutes: number }> = {}

  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { count: 0, totalMinutes: 0 }
  }

  sessions?.forEach((session: any) => {
    const hour = new Date(session.start_time).getHours()
    hourlyData[hour].count++
    hourlyData[hour].totalMinutes += session.duration_minutes || 0
  })

  // Find best times (most productive hours)
  const bestTimes = Object.entries(hourlyData)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      avgMinutes: data.count > 0 ? data.totalMinutes / data.count : 0,
      sessionCount: data.count
    }))
    .filter(t => t.sessionCount > 0)
    .sort((a, b) => b.avgMinutes - a.avgMinutes)
    .slice(0, 3)

  return bestTimes
}

export async function getMonthlyComparison(months: number = 6) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const startDate = subMonths(new Date(), months)

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('start_time, duration_minutes')
    .eq('user_id', user.id)
    .gte('start_time', startDate.toISOString())

  // Group by month
  const monthlyData: Record<string, number> = {}

  sessions?.forEach((session: any) => {
    const month = format(new Date(session.start_time), 'MMM yyyy')
    monthlyData[month] = (monthlyData[month] || 0) + (session.duration_minutes || 0)
  })

  return monthlyData
}

export async function getCompletionRateByTimeOfDay() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: plans } = await supabase
    .from('study_plans')
    .select('start_time, status')
    .eq('user_id', user.id)
    .not('start_time', 'is', null)
    .gte('planned_date', subMonths(new Date(), 3).toISOString().split('T')[0])

  // Group by hour and calculate completion rate
  const hourlyCompletion: Record<number, { total: number; completed: number }> = {}

  for (let i = 0; i < 24; i++) {
    hourlyCompletion[i] = { total: 0, completed: 0 }
  }

  plans?.forEach((plan: any) => {
    const hour = parseInt(plan.start_time.split(':')[0])
    hourlyCompletion[hour].total++
    if (plan.status === 'completed') {
      hourlyCompletion[hour].completed++
    }
  })

  return Object.entries(hourlyCompletion)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      totalPlans: data.total
    }))
    .filter(h => h.totalPlans > 0)
}


export async function getStudyStreak() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('start_time')
    .eq('user_id', user.id)
    .order('start_time', { ascending: false })

  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalDays: 0 }
  }

  // Get unique study dates
  const studyDates = [...new Set(sessions.map((s: any) => format(new Date(s.start_time), 'yyyy-MM-dd')))]
    .sort()
    .reverse()

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 1

  // Calculate current streak
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  if (studyDates[0] === today || studyDates[0] === yesterday) {
    currentStreak = 1
    for (let i = 1; i < studyDates.length; i++) {
      const prevDate = new Date(studyDates[i - 1])
      const currDate = new Date(studyDates[i])
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < studyDates.length; i++) {
    const prevDate = new Date(studyDates[i - 1])
    const currDate = new Date(studyDates[i])
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak)

  return {
    currentStreak,
    longestStreak,
    totalDays: studyDates.length
  }
}

export async function getStudyRecommendations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [
    weeklyPattern,
    bestTimes,
    completionRates,
    subjectDistribution,
    streak
  ] = await Promise.all([
    getWeeklyStudyPattern(),
    getBestStudyTimes(),
    getCompletionRateByTimeOfDay(),
    getSubjectTimeDistribution(),
    getStudyStreak()
  ])

  const recommendations: Array<{ type: string; title: string; description: string; priority: 'high' | 'medium' | 'low' }> = []

  // Check for weak days
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const weakDays = weekDays.filter(day => weeklyPattern[day].totalMinutes < 60)
  
  if (weakDays.length > 0) {
    recommendations.push({
      type: 'schedule',
      title: 'Strengthen Weak Days',
      description: `You study less on ${weakDays.join(', ')}. Consider scheduling more sessions on these days.`,
      priority: 'high'
    })
  }

  // Check for streak
  if (streak.currentStreak === 0) {
    recommendations.push({
      type: 'motivation',
      title: 'Start a Study Streak',
      description: 'Study today to start building a consistent habit. Even 15 minutes counts!',
      priority: 'high'
    })
  } else if (streak.currentStreak < 7) {
    recommendations.push({
      type: 'motivation',
      title: 'Build Your Streak',
      description: `You're on a ${streak.currentStreak}-day streak! Keep it going to reach 7 days.`,
      priority: 'medium'
    })
  }

  // Check for subject balance
  if (subjectDistribution.length > 0) {
    const totalMinutes = subjectDistribution.reduce((acc, s) => acc + s.minutes, 0)
    const avgMinutes = totalMinutes / subjectDistribution.length
    const neglectedSubjects = subjectDistribution.filter(s => s.minutes < avgMinutes * 0.5)
    
    if (neglectedSubjects.length > 0) {
      recommendations.push({
        type: 'balance',
        title: 'Balance Your Subjects',
        description: `${neglectedSubjects.map(s => s.name).join(', ')} need${neglectedSubjects.length === 1 ? 's' : ''} more attention.`,
        priority: 'medium'
      })
    }
  }

  // Optimal study time recommendation
  if (bestTimes.length > 0) {
    const bestHour = bestTimes[0].hour
    recommendations.push({
      type: 'optimization',
      title: 'Optimize Your Schedule',
      description: `You're most productive around ${bestHour}:00. Try scheduling important topics during this time.`,
      priority: 'low'
    })
  }

  // Check completion rates
  const avgCompletionRate = completionRates.reduce((acc, r) => acc + r.completionRate, 0) / completionRates.length
  
  if (avgCompletionRate < 60) {
    recommendations.push({
      type: 'planning',
      title: 'Improve Task Completion',
      description: `Your average completion rate is ${Math.round(avgCompletionRate)}%. Try breaking tasks into smaller chunks.`,
      priority: 'high'
    })
  }

  return recommendations
}

export async function getSubjectPerformance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subjects } = await supabase
    .from('subjects')
    .select(`
      id,
      name,
      color,
      topics (
        id,
        status
      ),
      study_sessions (
        duration_minutes
      )
    `)
    .eq('user_id', user.id)

  const performance = subjects?.map((subject: any) => {
    const totalTopics = subject.topics?.length || 0
    const completedTopics = subject.topics?.filter((t: any) => t.status === 'completed').length || 0
    const inProgressTopics = subject.topics?.filter((t: any) => t.status === 'in_progress').length || 0
    const totalMinutes = subject.study_sessions?.reduce((acc: number, s: any) => acc + (s.duration_minutes || 0), 0) || 0
    
    const completionRate = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0

    return {
      id: subject.id,
      name: subject.name,
      color: subject.color,
      totalTopics,
      completedTopics,
      inProgressTopics,
      notStartedTopics: totalTopics - completedTopics - inProgressTopics,
      totalMinutes,
      completionRate: Math.round(completionRate)
    }
  }) || []

  return performance.sort((a, b) => b.completionRate - a.completionRate)
}

export async function getFocusScore() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const last7Days = subDays(new Date(), 7)

  const [sessions, plans] = await Promise.all([
    supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .gte('start_time', last7Days.toISOString()),
    supabase
      .from('study_plans')
      .select('status, estimated_minutes')
      .eq('user_id', user.id)
      .gte('planned_date', format(last7Days, 'yyyy-MM-dd'))
  ])

  const totalStudyMinutes = sessions.data?.reduce((acc, s: any) => acc + (s.duration_minutes || 0), 0) || 0
  const completedPlans = plans.data?.filter((p: any) => p.status === 'completed').length || 0
  const totalPlans = plans.data?.length || 0
  const avgSessionLength = sessions.data?.length ? totalStudyMinutes / sessions.data.length : 0

  // Calculate focus score (0-100)
  const completionScore = totalPlans > 0 ? (completedPlans / totalPlans) * 40 : 0
  const consistencyScore = sessions.data?.length ? Math.min((sessions.data.length / 7) * 30, 30) : 0
  const durationScore = Math.min((avgSessionLength / 60) * 30, 30)

  const focusScore = Math.round(completionScore + consistencyScore + durationScore)

  return {
    score: focusScore,
    totalStudyMinutes,
    completedPlans,
    totalPlans,
    avgSessionLength: Math.round(avgSessionLength),
    sessionsCount: sessions.data?.length || 0
  }
}

export async function getUpcomingDeadlinesAnalytics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: deadlines } = await supabase
    .from('deadlines')
    .select(`
      id,
      title,
      due_date,
      priority,
      status,
      type,
      subjects (name, color)
    `)
    .eq('user_id', user.id)
    .gte('due_date', new Date().toISOString())
    .order('due_date', { ascending: true })
    .limit(10)

  return deadlines?.map((d: any) => ({
    ...d,
    daysUntil: Math.ceil((new Date(d.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  })) || []
}

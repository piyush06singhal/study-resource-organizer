'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getDashboardStats() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    // Get subjects count
    const { count: subjectsCount } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get topics count and completion stats
    const { data: topics } = await supabase
      .from('topics')
      .select('status')
      .eq('user_id', user.id)

    const completedTopics = topics?.filter((t: any) => t.status === 'completed').length || 0
    const totalTopics = topics?.length || 0
    const inProgressTopics = topics?.filter((t: any) => t.status === 'in_progress').length || 0

    // Get upcoming deadlines count
    const { count: upcomingDeadlines } = await supabase
      .from('deadlines')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .gte('due_date', new Date().toISOString())

    // Get study sessions this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .gte('start_time', weekAgo.toISOString())

    const totalStudyTime = sessions?.reduce((acc, s: any) => acc + (s.duration_minutes || 0), 0) || 0

    return {
      subjectsCount: subjectsCount || 0,
      totalTopics,
      completedTopics,
      inProgressTopics,
      upcomingDeadlines: upcomingDeadlines || 0,
      totalStudyTime,
      completionRate: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    }
  } catch (error) {
    console.error('Error in getDashboardStats:', error)
    return {
      subjectsCount: 0,
      totalTopics: 0,
      completedTopics: 0,
      inProgressTopics: 0,
      upcomingDeadlines: 0,
      totalStudyTime: 0,
      completionRate: 0
    }
  }
}

export async function getRecentActivity() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    // Get recent study sessions
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select(`
        id,
        start_time,
        duration_minutes,
        subjects (name, color),
        topics (name)
      `)
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })
      .limit(5)

    // Get recent topics updated
    const { data: recentTopics } = await supabase
      .from('topics')
      .select(`
        id,
        name,
        status,
        updated_at,
        subjects (name, color)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(5)

    return {
      sessions: sessions || [],
      recentTopics: recentTopics || []
    }
  } catch (error) {
    console.error('Error in getRecentActivity:', error)
    return {
      sessions: [],
      recentTopics: []
    }
  }
}

export async function getUpcomingDeadlines() {
  try {
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
        type,
        due_date,
        priority,
        status,
        subjects (name, color)
      `)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .gte('due_date', new Date().toISOString())
      .order('due_date', { ascending: true })
      .limit(5)

    return deadlines || []
  } catch (error) {
    console.error('Error in getUpcomingDeadlines:', error)
    return []
  }
}

export async function getStudyStreak() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    // Get all study sessions ordered by date
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('start_time')
      .eq('user_id', user.id)
      .order('start_time', { ascending: false })

    if (!sessions || sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 }
    }

    // Calculate current streak
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const sessionDates = sessions.map((s: any) => {
      const date = new Date(s.start_time)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })
    
    const uniqueDates = [...new Set(sessionDates)].sort((a, b) => b - a)
    
    // Check if studied today or yesterday
    const lastStudyDate = new Date(uniqueDates[0])
    const daysDiff = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 1) {
      currentStreak = 1
      
      for (let i = 1; i < uniqueDates.length; i++) {
        const diff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24))
        if (diff === 1) {
          currentStreak++
        } else {
          break
        }
      }
    }
    
    // Calculate longest streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24))
      if (diff === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak)

    return { currentStreak, longestStreak }
  } catch (error) {
    console.error('Error in getStudyStreak:', error)
    return { currentStreak: 0, longestStreak: 0 }
  }
}

export async function getSubjectProgress() {
  try {
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
        topics (id, status)
      `)
      .eq('user_id', user.id)
      .limit(5)

    const subjectsWithProgress = subjects?.map((subject: any) => {
      const topics = subject.topics || []
      const completed = topics.filter((t: any) => t.status === 'completed').length
      const total = topics.length
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        progress,
        totalTopics: total,
        completedTopics: completed
      }
    })

    return subjectsWithProgress || []
  } catch (error) {
    console.error('Error in getSubjectProgress:', error)
    return []
  }
}

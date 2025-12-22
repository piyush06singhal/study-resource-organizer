'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getDeadlines(filters?: {
  status?: string
  type?: string
  priority?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('deadlines')
    .select(`
      id,
      title,
      description,
      type,
      due_date,
      priority,
      status,
      reminder_sent,
      created_at,
      subject_id,
      subjects (id, name, color)
    `)
    .eq('user_id', user.id)

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  if (filters?.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority)
  }

  const { data: deadlines, error } = await query.order('due_date', { ascending: true })

  if (error) {
    console.error('Error fetching deadlines:', error)
    return []
  }

  return deadlines || []
}

export async function getDeadlineById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: deadline, error } = await supabase
    .from('deadlines')
    .select(`
      *,
      subjects (id, name, color)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching deadline:', error)
    return null
  }

  return deadline
}

export async function createDeadline(formData: {
  title: string
  description?: string
  type: string
  due_date: string
  priority?: string
  subject_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Convert empty string to null for UUID field
  const subject_id = formData.subject_id && formData.subject_id !== '' ? formData.subject_id : null

  const { data, error } = await supabase
    .from('deadlines')
    // @ts-ignore - Supabase type inference issue
    .insert({
      user_id: user.id,
      title: formData.title,
      description: formData.description || null,
      type: formData.type,
      due_date: formData.due_date,
      priority: formData.priority || 'medium',
      subject_id,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating deadline:', error)
    return { error: error.message }
  }

  revalidatePath('/deadlines')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateDeadline(id: string, formData: {
  title: string
  description?: string
  type: string
  due_date: string
  priority?: string
  status?: string
  subject_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Convert empty string to null for UUID field
  const subject_id = formData.subject_id && formData.subject_id !== '' ? formData.subject_id : null

  const { data, error } = await supabase
    .from('deadlines')
    // @ts-ignore - Supabase type inference issue
    .update({
      title: formData.title,
      description: formData.description || null,
      type: formData.type,
      due_date: formData.due_date,
      priority: formData.priority,
      status: formData.status,
      subject_id
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating deadline:', error)
    return { error: error.message }
  }

  revalidatePath('/deadlines')
  revalidatePath(`/deadlines/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateDeadlineStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('deadlines')
    // @ts-expect-error - Supabase type inference issue
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating deadline status:', error)
    return { error: error.message }
  }

  revalidatePath('/deadlines')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function deleteDeadline(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('deadlines')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting deadline:', error)
    return { error: error.message }
  }

  revalidatePath('/deadlines')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getDeadlineStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { total: 0, pending: 0, completed: 0, overdue: 0 }
  }

  const { data: deadlines } = await supabase
    .from('deadlines')
    .select('status, due_date')
    .eq('user_id', user.id)

  type DeadlineStats = { status: string; due_date: string }[]
  const now = new Date()
  const total = deadlines?.length || 0
  const pending = (deadlines as DeadlineStats)?.filter(d => d.status === 'pending').length || 0
  const completed = (deadlines as DeadlineStats)?.filter(d => d.status === 'completed').length || 0
  const overdue = (deadlines as DeadlineStats)?.filter(d => 
    d.status === 'pending' && new Date(d.due_date) < now
  ).length || 0

  return { total, pending, completed, overdue }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { addDays } from 'date-fns'

export async function getRevisions(topicId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('revisions')
    .select(`
      id,
      revision_number,
      revision_date,
      notes,
      confidence_level,
      next_revision_date,
      created_at,
      topic_id,
      topics (
        id,
        name,
        subjects (id, name, color)
      )
    `)
    .eq('user_id', user.id)

  if (topicId) {
    query = query.eq('topic_id', topicId)
  }

  const { data: revisions, error } = await query.order('revision_date', { ascending: false })

  if (error) {
    console.error('Error fetching revisions:', error)
    return []
  }

  return revisions
}

export async function createRevision(formData: {
  topic_id: string
  notes?: string
  confidence_level?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get the last revision number for this topic
  const { data: lastRevision } = await supabase
    .from('revisions')
    .select('revision_number')
    .eq('topic_id', formData.topic_id)
    .order('revision_number', { ascending: false })
    .limit(1)
    .single()

  const nextRevisionNumber = (lastRevision?.revision_number || 0) + 1

  // Calculate next revision date based on spaced repetition
  const intervals = [1, 3, 7, 14, 30] // days
  const nextInterval = intervals[Math.min(nextRevisionNumber - 1, intervals.length - 1)]
  const nextRevisionDate = addDays(new Date(), nextInterval)

  const { data, error } = await supabase
    .from('revisions')
    .insert({
      user_id: user.id,
      topic_id: formData.topic_id,
      revision_number: nextRevisionNumber,
      revision_date: new Date().toISOString(),
      notes: formData.notes,
      confidence_level: formData.confidence_level,
      next_revision_date: nextRevisionDate.toISOString().split('T')[0]
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating revision:', error)
    return { error: error.message }
  }

  revalidatePath('/revisions')
  revalidatePath(`/topics/${formData.topic_id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function getTopicsNeedingRevision() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: revisions } = await supabase
    .from('revisions')
    .select(`
      topic_id,
      next_revision_date,
      topics (
        id,
        name,
        subjects (id, name, color)
      )
    `)
    .eq('user_id', user.id)
    .lte('next_revision_date', today)
    .order('next_revision_date', { ascending: true })

  return revisions || []
}

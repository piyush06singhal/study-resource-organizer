'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getTopics(subjectId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('topics')
    .select(`
      id,
      name,
      description,
      status,
      priority,
      order_index,
      created_at,
      updated_at,
      subject_id,
      subjects (id, name, color)
    `)
    .eq('user_id', user.id)

  if (subjectId) {
    query = query.eq('subject_id', subjectId)
  }

  const { data: topics, error } = await query.order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching topics:', error)
    return []
  }

  return topics
}

export async function getTopicById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: topic, error } = await supabase
    .from('topics')
    .select(`
      *,
      subjects (id, name, color),
      revisions (
        id,
        revision_number,
        revision_date,
        confidence_level,
        notes
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching topic:', error)
    return null
  }

  return topic
}

export async function createTopic(formData: {
  name: string
  description?: string
  subject_id: string
  status?: string
  priority?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get the max order_index for this subject
  const { data: maxOrder } = await supabase
    .from('topics')
    .select('order_index')
    .eq('subject_id', formData.subject_id)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxOrder?.order_index || 0) + 1

  const { data, error } = await supabase
    .from('topics')
    .insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      subject_id: formData.subject_id,
      status: formData.status || 'not_started',
      priority: formData.priority || 'medium',
      order_index: nextOrder
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating topic:', error)
    return { error: error.message }
  }

  revalidatePath('/topics')
  revalidatePath(`/subjects/${formData.subject_id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateTopic(id: string, formData: {
  name: string
  description?: string
  subject_id: string
  status?: string
  priority?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('topics')
    .update({
      name: formData.name,
      description: formData.description,
      subject_id: formData.subject_id,
      status: formData.status,
      priority: formData.priority
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating topic:', error)
    return { error: error.message }
  }

  revalidatePath('/topics')
  revalidatePath(`/topics/${id}`)
  revalidatePath(`/subjects/${formData.subject_id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateTopicStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('topics')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating topic status:', error)
    return { error: error.message }
  }

  revalidatePath('/topics')
  revalidatePath(`/topics/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function deleteTopic(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting topic:', error)
    return { error: error.message }
  }

  revalidatePath('/topics')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function reorderTopics(topicIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Update order_index for each topic
  const updates = topicIds.map((id, index) =>
    supabase
      .from('topics')
      .update({ order_index: index })
      .eq('id', id)
      .eq('user_id', user.id)
  )

  await Promise.all(updates)

  revalidatePath('/topics')
  return { success: true }
}

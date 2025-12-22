'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNote(data: {
  title: string
  content: string
  contentType?: 'markdown' | 'rich_text'
  subjectId?: string
  topicId?: string
  tags?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: note, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      title: data.title,
      content: data.content,
      content_type: data.contentType || 'markdown',
      subject_id: data.subjectId,
      topic_id: data.topicId,
      tags: data.tags || []
    } as any)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/notes')
  return note
}

export async function getNotes(filters?: {
  subjectId?: string
  topicId?: string
  tag?: string
  search?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  let query = supabase
    .from('notes')
    .select(`
      *,
      subjects(name, color),
      topics(name)
    `)
    .eq('user_id', user.id)

  if (filters?.subjectId) {
    query = query.eq('subject_id', filters.subjectId)
  }

  if (filters?.topicId) {
    query = query.eq('topic_id', filters.topicId)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }

  const { data, error } = await query.order('updated_at', { ascending: false })

  if (error) throw error

  // Filter by tag if provided (client-side since Supabase doesn't support array contains easily)
  if (filters?.tag && data) {
    return (data as any[]).filter(note => note.tags?.includes(filters.tag))
  }

  return data
}

export async function getNote(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('notes')
    .select(`
      *,
      subjects(name, color),
      topics(name)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateNote(id: string, updates: {
  title?: string
  content?: string
  contentType?: 'markdown' | 'rich_text'
  subjectId?: string
  topicId?: string
  tags?: string[]
  isFavorite?: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: any = {
    title: updates.title,
    content: updates.content,
    content_type: updates.contentType,
    subject_id: updates.subjectId,
    topic_id: updates.topicId,
    tags: updates.tags,
    is_favorite: updates.isFavorite,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await (supabase
    .from('notes') as any)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/notes')
  revalidatePath(`/notes/${id}`)
  return data
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/notes')
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: any = { is_favorite: isFavorite }
  const { error } = await (supabase
    .from('notes') as any)
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/notes')
}

export async function getFavoritesNotes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('notes')
    .select(`
      *,
      subjects(name, color),
      topics(name)
    `)
    .eq('user_id', user.id)
    .eq('is_favorite', true)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllTags() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('notes')
    .select('tags')
    .eq('user_id', user.id)

  if (error) throw error

  // Extract unique tags
  const allTags = new Set<string>()
  ;(data as any[])?.forEach(note => {
    note.tags?.forEach((tag: string) => allTags.add(tag))
  })

  return Array.from(allTags).sort()
}

// AI-powered note summarization
export async function generateNoteSummary(content: string): Promise<string> {
  // Simple extractive summarization (in production, use OpenAI API)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const topSentences = sentences.slice(0, Math.min(3, sentences.length))
  return topSentences.join('. ') + '.'
}

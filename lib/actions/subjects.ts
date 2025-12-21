'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getSubjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subjects, error } = await supabase
    .from('subjects')
    .select(`
      id,
      name,
      code,
      color,
      description,
      created_at,
      semester_id,
      semesters (name),
      topics (id, status)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching subjects:', error)
    return []
  }

  // Calculate progress for each subject
  const subjectsWithProgress = (subjects || []).map((subject: any) => {
    const topics = subject.topics || []
    const completed = topics.filter((t: any) => t.status === 'completed').length
    const total = topics.length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      ...subject,
      topicsCount: total,
      completedTopics: completed,
      progress
    }
  })

  return subjectsWithProgress
}

export async function getSubjectById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: subject, error } = await supabase
    .from('subjects')
    .select(`
      *,
      semesters (id, name),
      topics (
        id,
        name,
        status,
        priority,
        created_at,
        updated_at
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching subject:', error)
    return null
  }

  return subject
}

export async function createSubject(formData: {
  name: string
  code?: string
  color: string
  description?: string
  semester_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await (supabase
    .from('subjects')
    .insert({
      user_id: user.id,
      name: formData.name,
      code: formData.code,
      color: formData.color,
      description: formData.description,
      semester_id: formData.semester_id
    })
    .select()
    .single() as any)

  if (error) {
    console.error('Error creating subject:', error)
    return { error: error.message }
  }

  revalidatePath('/subjects')
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function updateSubject(id: string, formData: {
  name: string
  code?: string
  color: string
  description?: string
  semester_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await (supabase
    .from('subjects')
    .update({
      name: formData.name,
      code: formData.code,
      color: formData.color,
      description: formData.description,
      semester_id: formData.semester_id
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single() as any)

  if (error) {
    console.error('Error updating subject:', error)
    return { error: error.message }
  }

  revalidatePath('/subjects')
  revalidatePath(`/subjects/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data }
}

export async function deleteSubject(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting subject:', error)
    return { error: error.message }
  }

  revalidatePath('/subjects')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getSemesters() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: semesters } = await supabase
    .from('semesters')
    .select('id, name')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return semesters || []
}

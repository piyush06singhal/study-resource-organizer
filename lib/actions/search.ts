'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function searchContent(query: string, filters?: {
  type?: string[]
  subjectId?: string
  topicId?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase.rpc('search_all_content' as any, {
    search_query: query,
    user_id_param: user.id
  } as any)

  if (error) throw error

  let results = (data || []) as any[]

  if (filters?.type && filters.type.length > 0) {
    results = results.filter((r: any) => filters.type!.includes(r.type))
  }

  await supabase
    .from('search_history' as any)
    .insert({
      user_id: user.id,
      query,
      filters: filters || {},
      result_count: results.length
    } as any)

  return results
}

export async function advancedSearch(params: {
  query?: string
  type?: string[]
  subjectId?: string
  topicId?: string
  tags?: string[]
  status?: string[]
  priority?: string[]
  dateFrom?: string
  dateTo?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const results: any[] = []

  if (!params.type || params.type.includes('resource')) {
    let resourceQuery = supabase
      .from('resources')
      .select('*, resource_topics(topics(*))')
      .eq('user_id', user.id)

    if (params.query) {
      resourceQuery = resourceQuery.or(`title.ilike.%${params.query}%,content.ilike.%${params.query}%`)
    }
    if (params.tags && params.tags.length > 0) {
      resourceQuery = resourceQuery.overlaps('tags', params.tags)
    }
    if (params.dateFrom) {
      resourceQuery = resourceQuery.gte('created_at', params.dateFrom)
    }
    if (params.dateTo) {
      resourceQuery = resourceQuery.lte('created_at', params.dateTo)
    }

    const { data: resources } = await resourceQuery
    if (resources) {
      results.push(...resources.map((r: any) => ({ ...r, searchType: 'resource' })))
    }
  }

  if (!params.type || params.type.includes('topic')) {
    let topicQuery = supabase
      .from('topics')
      .select('*, subjects(*)')
      .eq('user_id', user.id)

    if (params.query) {
      topicQuery = topicQuery.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%`)
    }
    if (params.subjectId) {
      topicQuery = topicQuery.eq('subject_id', params.subjectId)
    }
    if (params.status && params.status.length > 0) {
      topicQuery = topicQuery.in('status', params.status)
    }
    if (params.priority && params.priority.length > 0) {
      topicQuery = topicQuery.in('priority', params.priority)
    }

    const { data: topics } = await topicQuery
    if (topics) {
      results.push(...topics.map((t: any) => ({ ...t, searchType: 'topic' })))
    }
  }

  if (!params.type || params.type.includes('subject')) {
    let subjectQuery = supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)

    if (params.query) {
      subjectQuery = subjectQuery.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%`)
    }

    const { data: subjects } = await subjectQuery
    if (subjects) {
      results.push(...subjects.map((s: any) => ({ ...s, searchType: 'subject' })))
    }
  }

  if (!params.type || params.type.includes('deadline')) {
    let deadlineQuery = supabase
      .from('deadlines')
      .select('*, subjects(*)')
      .eq('user_id', user.id)

    if (params.query) {
      deadlineQuery = deadlineQuery.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%`)
    }
    if (params.subjectId) {
      deadlineQuery = deadlineQuery.eq('subject_id', params.subjectId)
    }
    if (params.status && params.status.length > 0) {
      deadlineQuery = deadlineQuery.in('status', params.status)
    }
    if (params.priority && params.priority.length > 0) {
      deadlineQuery = deadlineQuery.in('priority', params.priority)
    }
    if (params.dateFrom) {
      deadlineQuery = deadlineQuery.gte('due_date', params.dateFrom)
    }
    if (params.dateTo) {
      deadlineQuery = deadlineQuery.lte('due_date', params.dateTo)
    }

    const { data: deadlines } = await deadlineQuery
    if (deadlines) {
      results.push(...deadlines.map((d: any) => ({ ...d, searchType: 'deadline' })))
    }
  }

  await supabase
    .from('search_history' as any)
    .insert({
      user_id: user.id,
      query: params.query || '',
      filters: params,
      result_count: results.length
    } as any)

  return results
}

export async function getSearchHistory(limit = 20) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('search_history' as any)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function clearSearchHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('search_history' as any)
    .delete()
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/search')
}

export async function saveSearch(name: string, query: string, filters: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('saved_searches' as any)
    .insert({
      user_id: user.id,
      name,
      query,
      filters
    } as any)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/search')
  return data
}

export async function getSavedSearches() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('saved_searches' as any)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function deleteSavedSearch(searchId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('saved_searches' as any)
    .delete()
    .eq('id', searchId)
    .eq('user_id', user.id)

  if (error) throw error
  revalidatePath('/search')
}

export async function getSearchSuggestions(query: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const suggestions: string[] = []

  const { data: subjects } = await supabase
    .from('subjects')
    .select('name')
    .eq('user_id', user.id)
    .ilike('name', `%${query}%`)
    .limit(5)

  if (subjects) {
    suggestions.push(...subjects.map((s: any) => s.name))
  }

  const { data: topics } = await supabase
    .from('topics')
    .select('name')
    .eq('user_id', user.id)
    .ilike('name', `%${query}%`)
    .limit(5)

  if (topics) {
    suggestions.push(...topics.map((t: any) => t.name))
  }

  const { data: resources } = await supabase
    .from('resources')
    .select('title')
    .eq('user_id', user.id)
    .ilike('title', `%${query}%`)
    .limit(5)

  if (resources) {
    suggestions.push(...resources.map((r: any) => r.title))
  }

  return [...new Set(suggestions)].slice(0, 10)
}

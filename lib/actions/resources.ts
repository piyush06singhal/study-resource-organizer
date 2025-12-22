'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getResources(filters?: {
  type?: string
  tags?: string[]
  search?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let query = supabase
    .from('resources')
    .select(`
      id,
      title,
      type,
      content,
      url,
      file_path,
      file_size,
      tags,
      created_at,
      updated_at
    `)
    .eq('user_id', user.id)

  // Apply filters
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }

  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags)
  }

  const { data: resources, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching resources:', error)
    return []
  }

  return resources || []
}

export async function getResourceById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: resource, error } = await supabase
    .from('resources')
    .select(`
      *,
      resource_topics (
        topics (
          id,
          name,
          subjects (id, name, color)
        )
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching resource:', error)
    return null
  }

  return resource
}

export async function createResource(formData: {
  title: string
  type: string
  content?: string
  url?: string
  file_path?: string
  file_size?: number
  tags?: string[]
  topic_ids?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: resource, error } = await supabase
    .from('resources')
    // @ts-expect-error - Supabase type inference issue
    .insert({
      user_id: user.id,
      title: formData.title,
      type: formData.type,
      content: formData.content,
      url: formData.url,
      file_path: formData.file_path,
      file_size: formData.file_size,
      tags: formData.tags || []
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating resource:', error)
    return { error: error.message }
  }

  // Link to topics if provided
  if (formData.topic_ids && formData.topic_ids.length > 0) {
    const topicLinks = formData.topic_ids.map(topic_id => ({
      resource_id: (resource as { id: string }).id,
      topic_id
    }))

    // @ts-expect-error - Supabase type inference issue
    await supabase.from('resource_topics').insert(topicLinks)
  }

  revalidatePath('/resources')
  revalidatePath('/dashboard')
  return { success: true, data: resource }
}

export async function updateResource(id: string, formData: {
  title: string
  type: string
  content?: string
  url?: string
  tags?: string[]
  topic_ids?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: resource, error } = await supabase
    .from('resources')
    // @ts-expect-error - Supabase type inference issue
    .update({
      title: formData.title,
      type: formData.type,
      content: formData.content,
      url: formData.url,
      tags: formData.tags || []
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating resource:', error)
    return { error: error.message }
  }

  // Update topic links
  if (formData.topic_ids !== undefined) {
    // Delete existing links
    await supabase
      .from('resource_topics')
      .delete()
      .eq('resource_id', id)

    // Add new links
    if (formData.topic_ids.length > 0) {
      const topicLinks = formData.topic_ids.map(topic_id => ({
        resource_id: id,
        topic_id
      }))

      // @ts-expect-error - Supabase type inference issue
      await supabase.from('resource_topics').insert(topicLinks)
    }
  }

  revalidatePath('/resources')
  revalidatePath(`/resources/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data: resource }
}

export async function deleteResource(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get resource to check for file
  const { data: resource } = await supabase
    .from('resources')
    .select('file_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  type ResourceWithFile = { file_path: string | null } | null
  // Delete file from storage if exists
  if ((resource as ResourceWithFile)?.file_path) {
    await supabase.storage
      .from('study-resources')
      .remove([(resource as unknown as { file_path: string }).file_path])
  }

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting resource:', error)
    return { error: error.message }
  }

  revalidatePath('/resources')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function uploadFile(fileData: {
  fileName: string
  fileType: string
  fileData: string
  fileSize: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    // Convert base64 to buffer
    const base64Data = fileData.fileData.split(',')[1]
    if (!base64Data) {
      return { error: 'Invalid file data' }
    }
    
    const buffer = Buffer.from(base64Data, 'base64')

    // Create unique file path
    const fileExt = fileData.fileName.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Check if bucket exists, if not return error with helpful message
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === 'study-resources')
    
    if (!bucketExists) {
      return { 
        error: 'Storage not configured. Please use URL option instead or contact administrator to set up storage bucket.' 
      }
    }

    const { error } = await supabase.storage
      .from('study-resources')
      .upload(fileName, buffer, {
        contentType: fileData.fileType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return { error: `Upload failed: ${error.message}. Try using URL option instead.` }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('study-resources')
      .getPublicUrl(fileName)

    return { 
      success: true, 
      file_path: publicUrl,
      file_size: fileData.fileSize
    }
  } catch (error) {
    console.error('Error processing file:', error)
    return { error: 'Failed to process file. Please try using URL option instead.' }
  }
}

export async function getAllTags() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: resources } = await supabase
    .from('resources')
    .select('tags')
    .eq('user_id', user.id)

  if (!resources) return []

  type ResourceWithTags = { tags: string[] | null }
  // Extract all unique tags
  const allTags = new Set<string>();
  (resources as ResourceWithTags[]).forEach((resource: ResourceWithTags) => {
    if (resource.tags) {
      resource.tags.forEach((tag: string) => allTags.add(tag))
    }
  })

  return Array.from(allTags).sort()
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    console.error('Error fetching profile:', error)
    return null
  }

  return {
    ...(profile as Record<string, any>),
    email: user.email
  }
}

export async function updateProfile(data: {
  full_name?: string
  avatar_url?: string
  bio?: string
  study_goal?: string
  notification_preferences?: any
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('profiles')
    // @ts-expect-error - Supabase type inference issue
    .update({
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      study_goal: data.study_goal,
      notification_preferences: data.notification_preferences,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const file = formData.get('avatar') as File
  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'File must be an image' }
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { success: false, error: 'File size must be less than 2MB' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError)
    return { success: false, error: uploadError.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('profiles')
    // @ts-expect-error - Supabase type inference issue
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) {
    console.error('Error updating profile with avatar:', updateError)
    return { success: false, error: updateError.message }
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { success: true, url: publicUrl }
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword
  })

  if (signInError) {
    return { success: false, error: 'Current password is incorrect' }
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error('Error updating password:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Note: This will trigger the cascade delete in the database
  // which will remove all user data
  const { error } = await supabase.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('Error deleting account:', error)
    return { success: false, error: error.message }
  }

  redirect('/login')
}

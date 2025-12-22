'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile, uploadAvatar } from '@/lib/actions/profile'
import { User, Upload, Loader2, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    study_goal: profile?.study_goal || ''
  })
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    const result = await updateProfile(formData)
    
    if (result.success) {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Failed to update profile')
    }
    
    setLoading(false)
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('avatar', file)

    const result = await uploadAvatar(formData)
    
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error || 'Failed to upload avatar')
    }
    
    setUploading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Avatar Upload */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
              <User className="h-12 w-12 text-blue-600" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="avatar" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4" />
              <span className="text-sm font-medium">Upload Avatar</span>
            </div>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </Label>
          <p className="text-xs text-gray-600 mt-2">
            Max 2MB. JPG, PNG, or GIF
          </p>
        </div>
      </div>

      {/* Email (Read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          value={profile?.email || ''}
          disabled
          className="bg-gray-100 border-gray-200"
        />
        <p className="text-xs text-gray-500">
          Email cannot be changed
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-gray-700 font-medium">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Enter your full name"
          className="border-gray-200"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-gray-700 font-medium">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell us about yourself"
          rows={4}
          className="border-gray-200"
        />
      </div>

      {/* Study Goal */}
      <div className="space-y-2">
        <Label htmlFor="study_goal" className="text-gray-700 font-medium">Study Goal</Label>
        <Input
          id="study_goal"
          value={formData.study_goal}
          onChange={(e) => setFormData({ ...formData, study_goal: e.target.value })}
          placeholder="e.g., Study 2 hours daily"
          className="border-gray-200"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save Changes
      </Button>
    </form>
  )
}

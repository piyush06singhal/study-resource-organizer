'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updatePassword } from '@/lib/actions/profile'
import { Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export function PasswordForm() {
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const result = await updatePassword(formData.currentPassword, formData.newPassword)
    
    if (result.success) {
      setSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setSuccess(false), 5000)
    } else {
      setError(result.error || 'Failed to update password')
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">Password updated successfully!</span>
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-gray-700 font-medium">Current Password</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
            className="border-gray-200 pr-10"
            placeholder="Enter current password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full hover:bg-transparent"
            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
          >
            {showPasswords.current ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
          </Button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-gray-700 font-medium">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
            className="border-gray-200 pr-10"
            placeholder="Enter new password (min 6 characters)"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full hover:bg-transparent"
            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
          >
            {showPasswords.new ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
          </Button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className="border-gray-200 pr-10"
            placeholder="Confirm new password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full hover:bg-transparent"
            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
          >
            {showPasswords.confirm ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Update Password
      </Button>
    </form>
  )
}

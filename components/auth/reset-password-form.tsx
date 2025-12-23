'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updatePassword } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionError, setSessionError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        setSessionError(true)
        setError('Your password reset link is invalid or has expired. Please request a new one.')
      }
    }
    
    checkSession()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const result = await updatePassword(password)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Password Reset!</h3>
          <p className="text-muted-foreground">
            Your password has been successfully reset.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to login page...
          </p>
        </div>
      </motion.div>
    )
  }

  if (sessionError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Link Expired</h3>
          <p className="text-muted-foreground">
            Your password reset link is invalid or has expired.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/forgot-password">
            Request New Reset Link
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">
            Back to Login
          </Link>
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          New Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            className="pl-10 pr-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Must be at least 6 characters long
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm New Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            className="pl-10 pr-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 text-base font-semibold relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Resetting password...
            </>
          ) : (
            'Reset Password'
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline transition-colors"
        >
          Sign in
        </Link>
      </div>
    </motion.form>
  )
}

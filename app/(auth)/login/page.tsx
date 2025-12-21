import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Logo and Brand */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            StudyFlow
          </span>
        </Link>
        <p className="text-muted-foreground">
          Welcome back! Sign in to continue your learning journey
        </p>
      </div>

      {/* Login Card */}
      <Card className="border-2 shadow-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleAuthButton />
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-primary transition-colors">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-primary transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}

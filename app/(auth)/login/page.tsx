import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { BookOpen, Sparkles, TrendingUp, Brain } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Logo and Brand */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/50">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            StudyFlow
          </span>
        </Link>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span>AI-Powered Learning Platform</span>
        </div>
      </div>

      {/* Login Card */}
      <Card className="border-2 border-blue-100 shadow-2xl bg-white">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-base">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 py-1 text-muted-foreground font-medium rounded-full">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleAuthButton />

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="font-semibold text-blue-600 hover:text-indigo-600 transition-colors underline-offset-4 hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-sm">
          <Brain className="h-5 w-5 mx-auto mb-1 text-blue-600" />
          <p className="text-xs font-medium text-gray-700">AI Study Plans</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-sm">
          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-600" />
          <p className="text-xs font-medium text-gray-700">Analytics</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-indigo-100 shadow-sm">
          <Sparkles className="h-5 w-5 mx-auto mb-1 text-indigo-600" />
          <p className="text-xs font-medium text-gray-700">Smart Notes</p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-blue-600 transition-colors">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-blue-600 transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}

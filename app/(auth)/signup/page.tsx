import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignupForm } from '@/components/auth/signup-form'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { BookOpen, Sparkles, Zap, Target, Brain } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
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
          <span>Start Your Learning Journey Today</span>
        </div>
      </div>

      {/* Signup Card */}
      <Card className="border-2 border-purple-100 shadow-2xl bg-white">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-base">
            Join thousands of students achieving their goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SignupForm />
          
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
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-purple-600 hover:text-indigo-600 transition-colors underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-sm">
          <Brain className="h-6 w-6 mb-2 text-blue-600" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">AI Study Plans</h3>
          <p className="text-xs text-gray-600">Smart scheduling based on your goals</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-sm">
          <Zap className="h-6 w-6 mb-2 text-purple-600" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Smart Analytics</h3>
          <p className="text-xs text-gray-600">Track progress and insights</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-indigo-200 shadow-sm">
          <Sparkles className="h-6 w-6 mb-2 text-indigo-600" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Rich Notes</h3>
          <p className="text-xs text-gray-600">Markdown, LaTeX & code support</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-green-200 shadow-sm">
          <Target className="h-6 w-6 mb-2 text-green-600" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Goal Tracking</h3>
          <p className="text-xs text-gray-600">Never miss a deadline</p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-purple-600 transition-colors">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline hover:text-purple-600 transition-colors">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}

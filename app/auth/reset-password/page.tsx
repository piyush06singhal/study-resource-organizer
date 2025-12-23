import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 relative z-10">
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
            Create a new password
          </p>
        </div>

        {/* Reset Password Card */}
        <Card className="border-2 shadow-xl bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/8 to-blue-400/8 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-2xl rotate-45 animate-bounce" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full animate-bounce" 
             style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-lg rotate-12 animate-bounce" 
             style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
      </div>
    </div>
  )
}

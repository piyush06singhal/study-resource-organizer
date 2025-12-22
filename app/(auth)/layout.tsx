import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-cyan-400/30 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/30 to-pink-400/30 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/20 to-blue-400/20 dark:from-indigo-600/15 dark:to-blue-600/15 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 dark:from-blue-500/30 dark:to-cyan-500/30 rounded-2xl rotate-45 animate-bounce" 
             style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-32 w-16 h-16 bg-gradient-to-br from-purple-400/40 to-pink-400/40 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full animate-bounce" 
             style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-indigo-400/40 to-purple-400/40 dark:from-indigo-500/30 dark:to-purple-500/30 rounded-lg rotate-12 animate-bounce" 
             style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
      </div>
    </div>
  )
}

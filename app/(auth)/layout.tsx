import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {children}
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

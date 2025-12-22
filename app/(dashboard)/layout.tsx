import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile with error handling
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  // If profile doesn't exist, create it silently
  if (!profile) {
    try {
      // @ts-expect-error - Supabase type inference issue
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || ''
      })
    } catch (e) {
      // Ignore errors - profile might already exist
      console.error('Profile creation error:', e)
    }
  }

  const userData = {
    email: user.email!,
    full_name: (profile as any)?.full_name || user.user_metadata?.full_name || undefined
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-[280px] transition-all duration-300">
        <Header user={userData} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

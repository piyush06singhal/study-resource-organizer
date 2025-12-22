import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Debug Information</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">User Info</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
          </pre>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Profile Status</h2>
          {profileError ? (
            <div className="text-red-500">
              <p className="font-semibold">Error:</p>
              <pre className="text-sm overflow-auto">{JSON.stringify(profileError, null, 2)}</pre>
            </div>
          ) : profile ? (
            <div className="text-green-500">
              <p className="font-semibold">Profile exists!</p>
              <pre className="text-sm overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-yellow-500">
              <p className="font-semibold">Profile not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

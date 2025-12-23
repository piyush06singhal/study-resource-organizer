import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      // Redirect to login with error
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // Check if this is an email confirmation (new signup)
    // If the user just confirmed their email, redirect to login
    if (data?.user && !data.user.last_sign_in_at) {
      return NextResponse.redirect(`${origin}/login?confirmed=true`)
    }
  }

  // For password resets and existing users, go to dashboard or specified next page
  return NextResponse.redirect(`${origin}${next}`)
}

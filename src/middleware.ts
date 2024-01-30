import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if(!user){
    return NextResponse.rewrite(new URL('/login', req.url))
  }
    return res
}

export const config = {
//   matcher: '/((?!api|_next/static|_next/image|favicon.ico).*',
  matcher: ['/', '/_sites/:path', '/home', '/login','/dashboard',],
}
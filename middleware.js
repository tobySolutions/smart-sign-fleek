// app/middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Only apply to /api/analyze-pdf endpoint
  if (request.nextUrl.pathname === '/api/analyze-pdf') {
    // Set appropriate headers for file uploads
    const response = NextResponse.next()
    response.headers.set('Accept', 'multipart/form-data')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - static files
     * - public folder
     * - _next (Next.js internals)
     */
    '/((?!api/|_next/|public/).*)',
  ],
}
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

export async function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Use IP address as identifier, fallback to a default
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'

    const { success, limit, remaining, reset } = await checkRateLimit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit?.toString() || '',
            'X-RateLimit-Remaining': remaining?.toString() || '',
            'X-RateLimit-Reset': reset?.toString() || '',
          },
        }
      )
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next()
    if (limit) response.headers.set('X-RateLimit-Limit', limit.toString())
    if (remaining !== undefined) response.headers.set('X-RateLimit-Remaining', remaining.toString())
    if (reset) response.headers.set('X-RateLimit-Reset', reset.toString())

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}

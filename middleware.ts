import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

/**
 * Get client IP address from request headers
 * Handles various proxy scenarios (Cloudflare, nginx, etc.)
 */
function getClientIP(request: NextRequest): string {
  // Cloudflare specific header
  const cfIP = request.headers.get('cf-connecting-ip')
  if (cfIP) return cfIP

  // Standard x-forwarded-for header (comma-separated list, first IP is client)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const firstIP = forwarded.split(',')[0].trim()
    if (firstIP) return firstIP
  }

  // nginx x-real-ip header
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP

  // Fallback for development
  return '127.0.0.1'
}

export async function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = getClientIP(request)

    const { success, limit, remaining, reset } = await checkRateLimit(ip)

    if (!success) {
      const headers = new Headers()
      if (limit !== undefined) headers.set('X-RateLimit-Limit', limit.toString())
      if (remaining !== undefined) headers.set('X-RateLimit-Remaining', remaining.toString())
      if (reset !== undefined) headers.set('X-RateLimit-Reset', reset.toString())

      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers }
      )
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next()
    if (limit !== undefined) response.headers.set('X-RateLimit-Limit', limit.toString())
    if (remaining !== undefined) response.headers.set('X-RateLimit-Remaining', remaining.toString())
    if (reset !== undefined) response.headers.set('X-RateLimit-Reset', reset.toString())

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}

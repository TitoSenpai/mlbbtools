import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Cloudflare-optimized headers for MLBB Tools
  const headers = new Headers(response.headers)
  
  // Cache optimization for static assets
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // API routes - short cache for dynamic content
    headers.set('Cache-Control', 'public, max-age=60, s-maxage=300')
    headers.set('CDN-Cache-Control', 'max-age=300') // Cloudflare specific
  } else if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    // Static assets - long cache
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('CDN-Cache-Control', 'max-age=31536000') // Cloudflare specific
  } else {
    // Pages - balanced cache for gaming content
    headers.set('Cache-Control', 'public, max-age=300, s-maxage=600')
    headers.set('CDN-Cache-Control', 'max-age=600') // Cloudflare specific
  }
  
  // Security headers optimized for gaming platform
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('X-XSS-Protection', '1; mode=block')
  
  // Performance headers for MLBB content
  headers.set('X-DNS-Prefetch-Control', 'on')
  headers.set('X-Powered-By', 'MLBB Tools on Cloudflare Workers')
  
  // CORS for API endpoints (if needed for external integrations)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  })
}

export const config = {
  matcher: [
    // Match all paths except those starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

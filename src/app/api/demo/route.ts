// Next.js 15 explicit caching example
// GET routes are no longer cached by default, so we need to be explicit

import { NextResponse } from 'next/server'

// Force static caching for this route
export const dynamic = 'force-static'

// Configure cache behavior (this will be cached)
export async function GET() {
  // Simulate API call with explicit caching
  const data = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    cache: 'force-cache', // Explicitly cache this request
    next: { revalidate: 300 } // Revalidate every 5 minutes
  })
  
  const post = await data.json()
  
  return NextResponse.json({
    message: 'MLBB API Response',
    timestamp: new Date().toISOString(),
    data: post,
    cached: true,
    revalidateIn: '5 minutes'
  })
}

// Example of a route that explicitly avoids caching
export async function POST() {
  const data = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    cache: 'no-store', // Explicitly avoid caching
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'New MLBB Post',
      body: 'This is a dynamic post',
      userId: 1,
    }),
  })
  
  const result = await data.json()
  
  return NextResponse.json({
    message: 'Dynamic API Response',
    timestamp: new Date().toISOString(),
    data: result,
    cached: false
  })
}

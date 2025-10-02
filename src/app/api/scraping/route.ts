import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    error: 'Scraping is disabled in production',
    message: 'Scraping operations should only be performed locally for security and performance reasons.'
  }, { status: 403 })
}

export async function POST() {
  return NextResponse.json({
    error: 'Scraping is disabled in production',
    message: 'Scraping operations should only be performed locally for security and performance reasons.'
  }, { status: 403 })
}
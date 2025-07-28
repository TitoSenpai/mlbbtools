// Clean API route for MLBB hero data with direct D1 access
import { NextRequest, NextResponse } from 'next/server'

interface CloudflareEnv {
  DB: D1Database
}

interface Hero {
  id: number
  name: string
  role: string
  region?: string
  lane?: string
  release_date?: string
  slug: string
  image_url?: string
  thumbnail_url?: string
  created_at: string
  updated_at: string
}

export async function GET() {
  try {
    // In Cloudflare Workers, environment variables and bindings are available on process.env
    const env = process.env as unknown as CloudflareEnv
    
    if (!env.DB) {
      return NextResponse.json(
        { error: 'Database not available - D1 not configured' },
        { status: 500 }
      )
    }

    console.log('📡 Fetching heroes from D1 database...')

    // Execute query to get all heroes
    const result = await env.DB.prepare(`
      SELECT id, name, role, region, lane, release_date, slug, image_url, thumbnail_url, created_at, updated_at 
      FROM heroes 
      ORDER BY name ASC
    `).all()

    const heroes = (result.results as unknown) as Hero[]

    console.log(`✅ Retrieved ${heroes.length} heroes from database`)

    return NextResponse.json({
      heroes: heroes,
      count: heroes.length,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('❌ Database error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch heroes', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        success: false
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const env = process.env as unknown as CloudflareEnv
    
    if (!env.DB) {
      return NextResponse.json(
        { error: 'Database not available - D1 not configured' },
        { status: 500 }
      )
    }

    const body = await request.json() as {
      action?: string
      hero?: Partial<Hero>
    }

    if (body.action === 'create-hero' && body.hero) {
      const { name, role, region, lane, slug } = body.hero
      
      if (!name || !role || !slug) {
        return NextResponse.json(
          { error: 'Missing required fields: name, role, slug' },
          { status: 400 }
        )
      }

      const result = await env.DB.prepare(`
        INSERT INTO heroes (name, role, region, lane, slug)
        VALUES (?, ?, ?, ?, ?)
      `).bind(name, role, region, lane, slug).run()

      if (result.success) {
        return NextResponse.json({
          success: true,
          heroId: result.meta.last_row_id,
          message: `Hero ${name} created successfully`
        })
      } else {
        return NextResponse.json(
          { error: 'Failed to create hero' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid action or missing data' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ POST error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'

// Cloudflare D1 Database Interface
interface CloudflareEnv {
  DB: D1Database
}

interface Hero {
  id: number
  name: string
  role: string
  image_url: string
  created_at: string
}

interface Ability {
  id: number
  hero_id: number
  ability_type: string
  name: string
  description: string
  cooldown?: string
  mana_cost?: string
  created_at: string
}

export async function GET() {
  try {
    // Check if we're in Cloudflare Workers environment
    const isCloudflareWorkers = !!process.env.CF_WORKERS_RUNTIME
    
    // In Next.js on Cloudflare Pages, D1 bindings are available through process.env
    const env = process.env as unknown as CloudflareEnv
    
    if (!env?.DB) {
      return NextResponse.json(
        { 
          error: 'Database not available - D1 not configured',
          environment: isCloudflareWorkers ? 'cloudflare-workers' : 'production',
          debug: {
            CF_WORKERS_RUNTIME: !!process.env.CF_WORKERS_RUNTIME,
            nodeEnv: process.env.NODE_ENV,
            hasEnvDB: !!env.DB
          }
        },
        { status: 500 }
      )
    }

    // Query all heroes
    const heroesResult = await env.DB.prepare('SELECT * FROM heroes ORDER BY name').all()
    const heroes = heroesResult.results as unknown as Hero[]

    // For each hero, get their abilities
    const heroesWithAbilities = await Promise.all(
      heroes.map(async (hero) => {
        const abilitiesResult = await env.DB.prepare(
          'SELECT * FROM abilities WHERE hero_id = ? ORDER BY ability_type'
        ).bind(hero.id).all()
        
        const abilities = abilitiesResult.results as unknown as Ability[]
        
        return {
          ...hero,
          abilities
        }
      })
    )

    return NextResponse.json(heroesWithAbilities)
  } catch (error) {
    console.error('Error fetching heroes:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch heroes',
        message: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    )
  }
}

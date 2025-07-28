import { NextRequest, NextResponse } from 'next/server'

// Cloudflare D1 Database Interface
interface Env {
  DB: D1Database
}

interface CloudflareRequest extends NextRequest {
  env?: Env
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

export async function GET(request: NextRequest) {
  try {
    // Get Cloudflare context
    const env = (request as CloudflareRequest).env
    
    if (!env?.DB) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
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
      { error: 'Failed to fetch heroes' },
      { status: 500 }
    )
  }
}

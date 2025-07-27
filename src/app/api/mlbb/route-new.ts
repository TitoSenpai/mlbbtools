// API route demonstrating Cloudflare D1 integration with MLBB Tools
import { NextRequest, NextResponse } from 'next/server'
import { MLBBDatabase, type CloudflareEnv, type Hero } from '@/lib/database'
import { allMLBBHeroes } from '@/data/heroes-data'

// Type definitions for API request bodies
interface MatchData {
  user_id: number
  hero_id: number
  game_mode: string
  result: 'win' | 'lose'
  kda_kills: number
  kda_deaths: number
  kda_assists: number
  damage_dealt: number
  damage_taken: number
  gold_earned: number
  match_duration: number
  mvp: boolean
}

interface BuildData {
  hero_id: number
  user_id: number
  build_name: string
  items: number[]
  emblem_set?: string
  spells?: number[]
  description?: string
  win_rate: number
  votes_up: number
  votes_down: number
  is_featured: boolean
}

interface HeroData {
  name: string
  role: string
  difficulty: string
  description?: string
  stats?: {
    damage: number
    durability: number
    cc: number
    mobility: number
  }
  win_rate?: number
  pick_rate?: number
  ban_rate?: number
  is_active?: boolean
  release_year?: number
  // Enhanced fields for detailed hero data
  title?: string
  specialty?: string[] | string // JSON array or string
  lane?: string
  price_bp?: number
  price_diamonds?: number
  skill_resource?: string
  damage_type?: string
  attack_type?: string
  detailed_stats?: Record<string, unknown> // JSON object
  abilities?: Record<string, unknown> // JSON object
  ratings?: Record<string, unknown> // JSON object
  lore?: string
  relationships?: string[] | string // JSON array or string
  voice_actors?: Record<string, unknown> // JSON object
  trivia?: string[] | string // JSON array or string
  portrait_url?: string
  splash_art_url?: string
}

interface RequestBody {
  action: string
  matchData?: MatchData
  buildData?: BuildData
  heroData?: HeroData
  eventType?: string
  userId?: number
  pagePath?: string
  metadata?: { 
    referrer?: string
    userAgent?: string
    country?: string 
  }
}

// This API route works with Cloudflare D1 database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    // Check if we're in Cloudflare Workers environment
    const isCloudflareWorkers = !!process.env.CF_WORKERS_RUNTIME
    
    // For local development, return mock data
    if (process.env.NODE_ENV === 'development' && !isCloudflareWorkers) {
      if (action === 'get-heroes') {
        // Return first 20 heroes from our complete dataset for development
        const devHeroes = allMLBBHeroes.slice(0, 20).map((hero, index) => ({
          id: index + 1,
          name: hero.name,
          role: hero.role,
          difficulty: hero.difficulty,
          win_rate: hero.win_rate,
          pick_rate: hero.pick_rate,
          ban_rate: hero.ban_rate,
          is_active: hero.is_active
        }))
        
        return NextResponse.json({
          success: true,
          data: devHeroes,
          message: 'Heroes retrieved successfully (development mode)',
          environment: 'development',
          total: allMLBBHeroes.length,
          showing: devHeroes.length
        })
      }
      
      return NextResponse.json({
        success: true,
        message: 'API working in development mode',
        environment: 'development',
        available_actions: ['get-heroes']
      })
    }

    // Production/Cloudflare environment
    // In Next.js on Cloudflare Pages, D1 bindings are available through process.env
    const env = process.env as unknown as CloudflareEnv
    
    if (!env.DB) {
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

    const mlbbDb = new MLBBDatabase(env.DB)

    switch (action) {
      case 'get-heroes':
        const heroes = await mlbbDb.getAllHeroes()
        return NextResponse.json({
          success: true,
          data: heroes,
          message: 'Heroes retrieved successfully',
          environment: 'production'
        })

      default:
        return NextResponse.json({
          success: true,
          message: 'MLBB Tools API - Production Environment',
          environment: 'production',
          available_actions: ['get-heroes'],
          timestamp: new Date().toISOString()
        })
    }

  } catch (error) {
    console.error('GET API error:', error)
    return NextResponse.json(
      { 
        error: 'Database operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody
    const { action } = body
    
    // Check if we're in Cloudflare Workers environment
    const isCloudflareWorkers = !!process.env.CF_WORKERS_RUNTIME
    
    // For local development, return mock responses
    if (process.env.NODE_ENV === 'development' && !isCloudflareWorkers) {
      switch (action) {
        case 'create-hero':
          const heroData = body.heroData
          if (!heroData) {
            return NextResponse.json(
              { error: 'Hero data is required' },
              { status: 400 }
            )
          }
          
          return NextResponse.json({
            success: true,
            data: {
              id: Math.floor(Math.random() * 1000) + 100,
              ...heroData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            message: `Hero ${heroData.name} created successfully (development mode)`,
            environment: 'development'
          })

        default:
          return NextResponse.json({
            success: true,
            message: 'POST API working in development mode',
            environment: 'development',
            action: action
          })
      }
    }

    // Production/Cloudflare environment
    const env = process.env as unknown as CloudflareEnv
    
    if (!env.DB) {
      return NextResponse.json(
        { error: 'Database not available - D1 not configured' },
        { status: 500 }
      )
    }

    const db = new MLBBDatabase(env.DB)

    switch (action) {
      case 'create-hero':
        const heroData = body.heroData
        if (!heroData) {
          return NextResponse.json(
            { error: 'Hero data is required' },
            { status: 400 }
          )
        }
        
        // Convert arrays to JSON strings for database storage
        const dbHeroData: Omit<Hero, 'id' | 'created_at' | 'updated_at'> = {
          name: heroData.name,
          role: heroData.role,
          difficulty: parseInt(heroData.difficulty.toString()),
          win_rate: heroData.win_rate || 0,
          pick_rate: heroData.pick_rate || 0,
          ban_rate: heroData.ban_rate || 0,
          is_active: heroData.is_active !== false,
          release_year: heroData.release_year,
          title: heroData.title,
          specialty: Array.isArray(heroData.specialty) ? JSON.stringify(heroData.specialty) : heroData.specialty,
          lane: heroData.lane,
          price_bp: heroData.price_bp,
          price_diamonds: heroData.price_diamonds,
          skill_resource: heroData.skill_resource,
          damage_type: heroData.damage_type,
          attack_type: heroData.attack_type,
          detailed_stats: heroData.detailed_stats ? JSON.stringify(heroData.detailed_stats) : undefined,
          abilities: heroData.abilities ? JSON.stringify(heroData.abilities) : undefined,
          ratings: heroData.ratings ? JSON.stringify(heroData.ratings) : undefined,
          lore: heroData.lore,
          relationships: Array.isArray(heroData.relationships) ? JSON.stringify(heroData.relationships) : heroData.relationships,
          voice_actors: heroData.voice_actors ? JSON.stringify(heroData.voice_actors) : undefined,
          trivia: Array.isArray(heroData.trivia) ? JSON.stringify(heroData.trivia) : heroData.trivia,
          portrait_url: heroData.portrait_url,
          splash_art_url: heroData.splash_art_url,
          avatar_url: heroData.portrait_url // Use portrait as avatar fallback
        }
        
        const hero = await db.createHero(dbHeroData)
        
        return NextResponse.json({
          success: true,
          data: hero,
          message: `Hero ${heroData.name} created successfully`
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('POST API error:', error)
    return NextResponse.json(
      { 
        error: 'Database operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    )
  }
}

// Enable CORS for external API access
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

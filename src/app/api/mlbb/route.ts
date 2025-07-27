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
    // For local development, return mock data
    if (process.env.NODE_ENV === 'development' && !process.env.CF_WORKERS_RUNTIME) {
      const { searchParams } = new URL(request.url)
      const action = searchParams.get('action')
      
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
        available_actions: ['get-heroes', 'get-user-stats', 'get-recent-matches']
      })
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
    const url = new URL(request.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'heroes':
        const heroes = await db.getAllHeroes()
        return NextResponse.json({
          success: true,
          data: heroes,
          count: heroes.length,
          message: 'Heroes retrieved successfully'
        })

      case 'hero-stats':
        const heroId = parseInt(url.searchParams.get('heroId') || '1')
        const hero = await db.getHeroById(heroId)
        const winRate = await db.getHeroWinRate(heroId)
        
        return NextResponse.json({
          success: true,
          data: {
            hero,
            recentWinRate: winRate,
            lastUpdated: new Date().toISOString()
          }
        })

      case 'dashboard-metrics':
        const metrics = await db.getDashboardMetrics()
        return NextResponse.json({
          success: true,
          data: metrics,
          timestamp: new Date().toISOString()
        })

      case 'blog-posts':
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const posts = await db.getPublishedPosts(limit)
        return NextResponse.json({
          success: true,
          data: posts,
          count: posts.length
        })

      default:
        // Default: Return database status
        return NextResponse.json({
          success: true,
          message: 'MLBB Tools D1 Database API',
          database: 'Connected',
          endpoints: [
            'GET /api/mlbb?action=heroes - Get all heroes',
            'GET /api/mlbb?action=hero-stats&heroId=1 - Get hero statistics',
            'GET /api/mlbb?action=dashboard-metrics - Get dashboard metrics',
            'GET /api/mlbb?action=blog-posts&limit=10 - Get blog posts'
          ],
          timestamp: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('Database error:', error)
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
    // For local development, return mock responses
    if (process.env.NODE_ENV === 'development' && !process.env.CF_WORKERS_RUNTIME) {
      const body = await request.json() as RequestBody
      const { action } = body
      
      switch (action) {
        case 'record-match':
          const matchData = body.matchData
          if (!matchData) {
            return NextResponse.json(
              { error: 'Match data is required' },
              { status: 400 }
            )
          }
          
          return NextResponse.json({
            success: true,
            data: {
              id: Math.floor(Math.random() * 1000),
              ...matchData,
              match_date: new Date().toISOString()
            },
            message: 'Match recorded successfully (development mode)',
            environment: 'development'
          })

        case 'create-build':
          const buildData = body.buildData
          if (!buildData) {
            return NextResponse.json(
              { error: 'Build data is required' },
              { status: 400 }
            )
          }
          
          return NextResponse.json({
            success: true,
            data: {
              id: Math.floor(Math.random() * 1000),
              ...buildData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            message: 'Hero build created successfully (development mode)',
            environment: 'development'
          })

        case 'track-analytics':
          if (!body.eventType) {
            return NextResponse.json(
              { error: 'Event type is required' },
              { status: 400 }
            )
          }
          
          return NextResponse.json({
            success: true,
            message: 'Analytics event recorded (development mode)',
            environment: 'development',
            data: {
              eventType: body.eventType,
              userId: body.userId,
              pagePath: body.pagePath,
              timestamp: new Date().toISOString()
            }
          })

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
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          )
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
    const body = await request.json() as RequestBody
    const { action } = body

    switch (action) {
      case 'record-match':
        const matchData = body.matchData
        if (!matchData) {
          return NextResponse.json(
            { error: 'Match data is required' },
            { status: 400 }
          )
        }
        
        const result = await db.recordMatch(matchData)
        
        // Also update hero statistics
        await db.updateHeroStats(matchData.hero_id, {
          win_rate: await db.getHeroWinRate(matchData.hero_id)
        })

        return NextResponse.json({
          success: true,
          data: result,
          message: 'Match recorded successfully'
        })

      case 'create-build':
        const buildData = body.buildData
        if (!buildData) {
          return NextResponse.json(
            { error: 'Build data is required' },
            { status: 400 }
          )
        }
        
        const build = await db.createHeroBuild(buildData)
        
        return NextResponse.json({
          success: true,
          data: build,
          message: 'Hero build created successfully'
        })

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

      case 'track-analytics':
        if (!body.eventType) {
          return NextResponse.json(
            { error: 'Event type is required' },
            { status: 400 }
          )
        }
        
        await db.recordAnalyticsEvent(
          body.eventType,
          body.userId,
          body.pagePath,
          body.metadata
        )

        return NextResponse.json({
          success: true,
          message: 'Analytics event recorded'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Database error:', error)
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

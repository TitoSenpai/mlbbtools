// Database service for MLBB Tools using Cloudflare D1
// Type-safe database operations for gaming statistics

export interface CloudflareEnv {
  DB: D1Database
  ASSETS: Fetcher
}

export interface User {
  id: number
  email: string
  username: string
  display_name: string
  avatar_url?: string
  mlbb_id?: string
  rank_tier?: string
  favorite_heroes?: number[]
  created_at: string
  updated_at: string
}

export interface Hero {
  id: number
  name: string
  role: string
  difficulty: number
  win_rate: number
  pick_rate: number
  ban_rate: number
  avatar_url?: string
  is_active: boolean
  release_date?: string
  created_at: string
  updated_at: string
  // Enhanced fields for detailed hero data
  release_year?: number
  title?: string
  specialty?: string // JSON string
  lane?: string
  price_bp?: number
  price_diamonds?: number
  skill_resource?: string
  damage_type?: string
  attack_type?: string
  detailed_stats?: string // JSON string
  abilities?: string // JSON string
  ratings?: string // JSON string
  lore?: string
  relationships?: string // JSON string
  voice_actors?: string // JSON string
  trivia?: string // JSON string
  portrait_url?: string
  splash_art_url?: string
}

export interface HeroBuild {
  id: number
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
  created_at: string
}

export interface MatchStats {
  id: number
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
  match_date: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  author_id: number
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  tags?: string[]
  view_count: number
  published_at?: string
  created_at: string
  updated_at: string
}

export class MLBBDatabase {
  constructor(private db: D1Database) {}

  // User operations
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const result = await this.db.prepare(`
      INSERT INTO users (email, username, display_name, avatar_url, mlbb_id, rank_tier, favorite_heroes)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
      RETURNING *
    `).bind(
      userData.email,
      userData.username,
      userData.display_name,
      userData.avatar_url,
      userData.mlbb_id,
      userData.rank_tier,
      JSON.stringify(userData.favorite_heroes)
    ).first<User>()

    if (!result) throw new Error('Failed to create user')
    return result
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.db.prepare(`
      SELECT * FROM users WHERE email = ?1
    `).bind(email).first<User>()

    if (user && user.favorite_heroes) {
      user.favorite_heroes = JSON.parse(user.favorite_heroes as unknown as string)
    }
    return user
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.db.prepare(`
      SELECT * FROM users WHERE id = ?1
    `).bind(id).first<User>()

    if (user && user.favorite_heroes) {
      user.favorite_heroes = JSON.parse(user.favorite_heroes as unknown as string)
    }
    return user
  }

  // Hero operations
  async getAllHeroes(): Promise<Hero[]> {
    const result = await this.db.prepare(`
      SELECT * FROM heroes WHERE is_active = TRUE ORDER BY name
    `).all<Hero>()
    return result.results
  }

  async getHeroById(id: number): Promise<Hero | null> {
    return await this.db.prepare(`
      SELECT * FROM heroes WHERE id = ?1 AND is_active = TRUE
    `).bind(id).first<Hero>()
  }

  async getHeroesByRole(role: string): Promise<Hero[]> {
    const result = await this.db.prepare(`
      SELECT * FROM heroes WHERE role = ?1 AND is_active = TRUE ORDER BY win_rate DESC
    `).bind(role).all<Hero>()
    return result.results
  }

  async updateHeroStats(id: number, stats: { win_rate?: number; pick_rate?: number; ban_rate?: number }): Promise<void> {
    await this.db.prepare(`
      UPDATE heroes 
      SET win_rate = COALESCE(?2, win_rate),
          pick_rate = COALESCE(?3, pick_rate),
          ban_rate = COALESCE(?4, ban_rate),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?1
    `).bind(id, stats.win_rate, stats.pick_rate, stats.ban_rate).run()
  }

  async createHero(heroData: Omit<Hero, 'id' | 'created_at' | 'updated_at'>): Promise<Hero> {
    const result = await this.db.prepare(`
      INSERT INTO heroes (
        name, role, difficulty, win_rate, pick_rate, ban_rate, avatar_url, is_active,
        release_date, release_year, title, specialty, lane, price_bp, price_diamonds,
        skill_resource, damage_type, attack_type, detailed_stats, abilities, ratings,
        lore, relationships, voice_actors, trivia, portrait_url, splash_art_url
      ) VALUES (
        ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15,
        ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24, ?25, ?26, ?27
      )
    `).bind(
      heroData.name,
      heroData.role,
      heroData.difficulty,
      heroData.win_rate,
      heroData.pick_rate,
      heroData.ban_rate,
      heroData.avatar_url,
      heroData.is_active,
      heroData.release_date,
      heroData.release_year,
      heroData.title,
      heroData.specialty,
      heroData.lane,
      heroData.price_bp,
      heroData.price_diamonds,
      heroData.skill_resource,
      heroData.damage_type,
      heroData.attack_type,
      heroData.detailed_stats,
      heroData.abilities,
      heroData.ratings,
      heroData.lore,
      heroData.relationships,
      heroData.voice_actors,
      heroData.trivia,
      heroData.portrait_url,
      heroData.splash_art_url
    ).run()

    return {
      id: result.meta.last_row_id as number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...heroData
    }
  }

  // Hero build operations
  async createHeroBuild(buildData: Omit<HeroBuild, 'id' | 'created_at' | 'updated_at'>): Promise<HeroBuild> {
    const result = await this.db.prepare(`
      INSERT INTO hero_builds (hero_id, user_id, build_name, items, emblem_set, spells, description, win_rate, votes_up, votes_down, is_featured)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
      RETURNING *
    `).bind(
      buildData.hero_id,
      buildData.user_id,
      buildData.build_name,
      JSON.stringify(buildData.items),
      buildData.emblem_set,
      JSON.stringify(buildData.spells),
      buildData.description,
      buildData.win_rate,
      buildData.votes_up,
      buildData.votes_down,
      buildData.is_featured
    ).first<HeroBuild>()

    if (!result) throw new Error('Failed to create hero build')
    return result
  }

  async getHeroBuilds(heroId: number, limit = 20): Promise<HeroBuild[]> {
    const result = await this.db.prepare(`
      SELECT hb.*, u.username as author_username
      FROM hero_builds hb
      JOIN users u ON hb.user_id = u.id
      WHERE hb.hero_id = ?1
      ORDER BY hb.is_featured DESC, hb.votes_up DESC
      LIMIT ?2
    `).bind(heroId, limit).all<HeroBuild>()
    
    return result.results.map(build => ({
      ...build,
      items: JSON.parse(build.items as unknown as string),
      spells: build.spells ? JSON.parse(build.spells as unknown as string) : undefined
    }))
  }

  // Match statistics
  async recordMatch(matchData: Omit<MatchStats, 'id' | 'match_date'>): Promise<MatchStats> {
    const result = await this.db.prepare(`
      INSERT INTO match_stats (user_id, hero_id, game_mode, result, kda_kills, kda_deaths, kda_assists, 
                              damage_dealt, damage_taken, gold_earned, match_duration, mvp)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
      RETURNING *
    `).bind(
      matchData.user_id, matchData.hero_id, matchData.game_mode, matchData.result,
      matchData.kda_kills, matchData.kda_deaths, matchData.kda_assists,
      matchData.damage_dealt, matchData.damage_taken, matchData.gold_earned,
      matchData.match_duration, matchData.mvp
    ).first<MatchStats>()

    if (!result) throw new Error('Failed to record match')
    return result
  }

  async getUserStats(userId: number, limit = 50): Promise<MatchStats[]> {
    const result = await this.db.prepare(`
      SELECT ms.*, h.name as hero_name
      FROM match_stats ms
      JOIN heroes h ON ms.hero_id = h.id
      WHERE ms.user_id = ?1
      ORDER BY ms.match_date DESC
      LIMIT ?2
    `).bind(userId, limit).all<MatchStats>()
    return result.results
  }

  async getHeroWinRate(heroId: number, days = 30): Promise<number> {
    const result = await this.db.prepare(`
      SELECT 
        COUNT(*) as total_matches,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins
      FROM match_stats 
      WHERE hero_id = ?1 
        AND match_date >= datetime('now', '-' || ?2 || ' days')
    `).bind(heroId, days).first<{ total_matches: number; wins: number }>()

    if (!result || result.total_matches === 0) return 0
    return (result.wins / result.total_matches) * 100
  }

  // Blog operations
  async createBlogPost(postData: Omit<BlogPost, 'id' | 'view_count' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const result = await this.db.prepare(`
      INSERT INTO blog_posts (title, slug, content, excerpt, author_id, featured_image, status, tags, published_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
      RETURNING *
    `).bind(
      postData.title, postData.slug, postData.content, postData.excerpt,
      postData.author_id, postData.featured_image, postData.status,
      JSON.stringify(postData.tags), postData.published_at
    ).first<BlogPost>()

    if (!result) throw new Error('Failed to create blog post')
    return result
  }

  async getPublishedPosts(limit = 20): Promise<BlogPost[]> {
    const result = await this.db.prepare(`
      SELECT bp.*, u.display_name as author_name
      FROM blog_posts bp
      JOIN users u ON bp.author_id = u.id
      WHERE bp.status = 'published'
      ORDER BY bp.published_at DESC
      LIMIT ?1
    `).bind(limit).all<BlogPost>()

    return result.results.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags as unknown as string) : []
    }))
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await this.db.prepare(`
      SELECT bp.*, u.display_name as author_name
      FROM blog_posts bp
      JOIN users u ON bp.author_id = u.id
      WHERE bp.slug = ?1 AND bp.status = 'published'
    `).bind(slug).first<BlogPost>()

    if (post && post.tags) {
      post.tags = JSON.parse(post.tags as unknown as string)
    }
    return post
  }

  async incrementPostViews(id: number): Promise<void> {
    await this.db.prepare(`
      UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?1
    `).bind(id).run()
  }

  // Analytics
  async recordAnalyticsEvent(
    eventType: string, 
    userId?: number, 
    pagePath?: string, 
    metadata?: { referrer?: string; userAgent?: string; country?: string }
  ): Promise<void> {
    await this.db.prepare(`
      INSERT INTO analytics_events (event_type, user_id, page_path, referrer, user_agent, ip_country)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6)
    `).bind(
      eventType,
      userId,
      pagePath,
      metadata?.referrer,
      metadata?.userAgent,
      metadata?.country
    ).run()
  }

  async getDashboardMetrics(): Promise<{
    totalUsers: number
    totalMatches: number
    totalPosts: number
    dailyActiveUsers: number
  }> {
    const [users, matches, posts, activeUsers] = await Promise.all([
      this.db.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>(),
      this.db.prepare('SELECT COUNT(*) as count FROM match_stats').first<{ count: number }>(),
      this.db.prepare('SELECT COUNT(*) as count FROM blog_posts WHERE status = "published"').first<{ count: number }>(),
      this.db.prepare(`
        SELECT COUNT(DISTINCT user_id) as count 
        FROM analytics_events 
        WHERE created_at >= datetime('now', '-1 day')
      `).first<{ count: number }>()
    ])

    return {
      totalUsers: users?.count || 0,
      totalMatches: matches?.count || 0,
      totalPosts: posts?.count || 0,
      dailyActiveUsers: activeUsers?.count || 0
    }
  }
}

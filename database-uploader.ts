#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

interface HeroData {
  basic_info: {
    name: string
    role: string
    slug: string
    image_url?: string
    thumbnail_url?: string
  }
  stats: {
    level?: number
    hp?: number
    mana?: number
    attack?: number
    defense?: number
    magic_defense?: number
    move_speed?: number
    attack_speed?: number
    crit_rate?: number
    regen_hp?: string
    regen_mana?: string
  }
  abilities: Array<{
    ability_type: 'Passive' | 'Skill1' | 'Skill2' | 'Ultimate'
    name: string
    description: string
    cooldown?: string
    mana_cost?: string
    damage_scaling?: string
    ap_scaling?: string
    ad_scaling?: string
    range_value?: string
    area_effect?: string
    additional_effects?: string
    icon_url?: string
  }>
  lore: {
    background?: string
    detailed_story?: string
    relationships?: string[]
    quotes?: string[]
    trivia?: string[]
  }
  patches: Array<{
    patch_version: string
    change_type: 'buff' | 'nerf' | 'rework' | 'new' | 'other'
    change_summary: string
    detailed_changes?: Record<string, unknown>
    change_date?: string
  }>
  esports_stats: Array<{
    tournament_name?: string
    pick_rate?: number
    ban_rate?: number
    win_rate?: number
    avg_kda?: string
    most_played_by?: string[]
    meta_tier?: string
    last_updated?: string
  }>
}

interface ScrapedData {
  timestamp: string
  totalHeroes: number
  successful: number
  failed: number
  heroes: HeroData[]
}

class DatabaseUploader {
  private dataPath: string
  private apiUrl: string

  constructor() {
    this.dataPath = path.join(process.cwd(), 'scraped-data', 'heroes-data.json')
    this.apiUrl = 'https://mlbbtools.titosenpaix.workers.dev/api'
  }

  async loadScrapedData(): Promise<ScrapedData> {
    try {
      if (!fs.existsSync(this.dataPath)) {
        throw new Error(`Data file not found: ${this.dataPath}`)
      }

      const fileContent = fs.readFileSync(this.dataPath, 'utf-8')
      const data: ScrapedData = JSON.parse(fileContent)
      
      console.log(`📁 Loaded ${data.heroes.length} heroes from scraped data`)
      return data
    } catch (error) {
      console.error('❌ Failed to load scraped data:', error)
      throw error
    }
  }

  async uploadHeroes(data: ScrapedData, batchSize: number = 10): Promise<void> {
    console.log(`🚀 Starting database upload...`)
    console.log(`📊 Total heroes to upload: ${data.heroes.length}`)
    console.log(`📦 Batch size: ${batchSize}`)

    const batches = this.createBatches(data.heroes, batchSize)
    let successCount = 0
    let failureCount = 0
    const failedHeroes: string[] = []

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`\n📦 Processing batch ${i + 1}/${batches.length} (${batch.length} heroes)`)
      
      try {
        const result = await this.uploadBatch(batch)
        successCount += result.successful
        failureCount += result.failed
        
        if (result.failed > 0) {
          failedHeroes.push(...result.failedHeroes)
        }

        console.log(`✅ Batch ${i + 1} completed: ${result.successful} successful, ${result.failed} failed`)
        
        // Wait between batches to avoid overwhelming the API
        if (i < batches.length - 1) {
          console.log(`⏳ Waiting 2s before next batch...`)
          await this.sleep(2000)
        }
      } catch (error) {
        console.error(`❌ Batch ${i + 1} failed completely:`, error)
        failureCount += batch.length
        failedHeroes.push(...batch.map(h => h.basic_info.name))
      }
    }

    // Final summary
    console.log(`\n🎉 Upload completed!`)
    console.log(`📊 Final results:`)
    console.log(`  - Total heroes processed: ${data.heroes.length}`)
    console.log(`  - Successful uploads: ${successCount}`)
    console.log(`  - Failed uploads: ${failureCount}`)
    console.log(`  - Success rate: ${((successCount / data.heroes.length) * 100).toFixed(1)}%`)
    
    if (failedHeroes.length > 0) {
      console.log(`\n❌ Failed heroes:`)
      failedHeroes.forEach(name => console.log(`  - ${name}`))
    }
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  private async uploadBatch(heroes: HeroData[]): Promise<{
    successful: number
    failed: number
    failedHeroes: string[]
  }> {
    try {
      // Transform heroes data for the API
      const heroesForUpload = heroes.map(hero => ({
        name: hero.basic_info.name,
        role: hero.basic_info.role === 'Unknown' ? 'Fighter' : hero.basic_info.role, // Default role
        image_url: hero.basic_info.image_url || '',
        abilities: hero.abilities.map(ability => ({
          name: ability.name === 'Ability Type' ? `${hero.basic_info.name} ${ability.ability_type}` : ability.name,
          type: ability.ability_type.toLowerCase(),
          description: ability.description,
          cooldown: ability.cooldown || null,
          mana_cost: ability.mana_cost || null
        }))
      }))

      console.log(`🔄 Uploading ${heroes.length} heroes...`)
      
      const response = await fetch(`${this.apiUrl}/heroes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'upload',
          heroes: heroesForUpload
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json() as {
        successful?: number
        failed?: number
        failedHeroes?: string[]
      }
      
      return {
        successful: result.successful || heroes.length,
        failed: result.failed || 0,
        failedHeroes: result.failedHeroes || []
      }
    } catch (error) {
      console.error(`❌ Batch upload failed:`, error)
      return {
        successful: 0,
        failed: heroes.length,
        failedHeroes: heroes.map(h => h.basic_info.name)
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(`🔍 Testing connection to ${this.apiUrl}/heroes...`)
      const response = await fetch(`${this.apiUrl}/heroes`)
      
      if (response.ok) {
        const data = await response.json() as { length?: number } | unknown[]
        const count = Array.isArray(data) ? data.length : (data as { length?: number }).length || 0
        console.log(`✅ Connection successful! Found ${count} existing heroes in database`)
        return true
      } else {
        console.log(`⚠️ API responded with status ${response.status}`)
        const text = await response.text()
        console.log(`Response: ${text}`)
        return false
      }
    } catch (error) {
      console.error(`❌ Connection test failed:`, error)
      return false
    }
  }

  async generateSQLFile(data: ScrapedData): Promise<void> {
    try {
      console.log(`📝 Generating SQL file for manual import...`)
      
      let sql = `-- Mobile Legends Heroes Data\n-- Generated: ${new Date().toISOString()}\n-- Total Heroes: ${data.heroes.length}\n\n`
      
      // Heroes table inserts
      sql += `-- Insert Heroes\n`
      for (const hero of data.heroes) {
        const name = hero.basic_info.name.replace(/'/g, "''")
        const role = hero.basic_info.role === 'Unknown' ? 'Fighter' : hero.basic_info.role
        const imageUrl = hero.basic_info.image_url || ''
        
        sql += `INSERT OR REPLACE INTO heroes (name, role, image_url) VALUES ('${name}', '${role}', '${imageUrl}');\n`
      }
      
      sql += `\n-- Insert Abilities\n`
      for (const hero of data.heroes) {
        const heroName = hero.basic_info.name.replace(/'/g, "''")
        
        for (const ability of hero.abilities) {
          const abilityName = (ability.name === 'Ability Type' ? `${hero.basic_info.name} ${ability.ability_type}` : ability.name).replace(/'/g, "''")
          const description = ability.description.replace(/'/g, "''")
          const type = ability.ability_type.toLowerCase()
          
          sql += `INSERT OR REPLACE INTO abilities (hero_name, name, type, description, cooldown, mana_cost) VALUES ('${heroName}', '${abilityName}', '${type}', '${description}', ${ability.cooldown ? `'${ability.cooldown}'` : 'NULL'}, ${ability.mana_cost ? `'${ability.mana_cost}'` : 'NULL'});\n`
        }
      }
      
      const sqlFilePath = path.join(process.cwd(), 'scraped-data', 'heroes-import.sql')
      fs.writeFileSync(sqlFilePath, sql)
      
      console.log(`✅ SQL file generated: ${sqlFilePath}`)
      console.log(`📊 Contains ${data.heroes.length} heroes and ${data.heroes.reduce((total, hero) => total + hero.abilities.length, 0)} abilities`)
    } catch (error) {
      console.error(`❌ Failed to generate SQL file:`, error)
      throw error
    }
  }
}

async function main() {
  const command = process.argv[2]
  const uploader = new DatabaseUploader()

  try {
    switch (command) {
      case 'test':
        console.log(`🧪 Testing database connection...`)
        const connected = await uploader.testConnection()
        if (connected) {
          console.log(`✅ Ready to proceed with upload!`)
        } else {
          console.log(`❌ Connection issues detected. Check your production site.`)
        }
        break

      case 'upload':
        const batchSize = parseInt(process.argv[3]) || 10
        console.log(`📤 Starting database upload with batch size: ${batchSize}`)
        
        const data = await uploader.loadScrapedData()
        await uploader.uploadHeroes(data, batchSize)
        break

      case 'sql':
        console.log(`📝 Generating SQL file for manual import...`)
        const sqlData = await uploader.loadScrapedData()
        await uploader.generateSQLFile(sqlData)
        break

      default:
        console.log(`🛠️ Database Uploader Commands:`)
        console.log(`  test     - Test connection to production database`)
        console.log(`  upload   - Upload all heroes to production database`)
        console.log(`  sql      - Generate SQL file for manual import`)
        console.log(``)
        console.log(`Examples:`)
        console.log(`  npx tsx database-uploader.ts test`)
        console.log(`  npx tsx database-uploader.ts upload 10`)
        console.log(`  npx tsx database-uploader.ts sql`)
        break
    }
  } catch (error) {
    console.error(`❌ Command failed:`, error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

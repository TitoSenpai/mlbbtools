#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// Interfaces matching our scraped data structure
interface ScrapedHero {
  basic_info: {
    name: string
    role: string
    slug: string
    image_url?: string
    thumbnail_url?: string
  }
  stats?: {
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
  abilities?: Array<{
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
  lore?: {
    background?: string
    detailed_story?: string
    relationships?: string[]
    quotes?: string[]
    trivia?: string[]
  }
  patches?: Array<{
    patch_version: string
    change_type: 'buff' | 'nerf' | 'rework' | 'new' | 'other'
    description: string
    date?: string
  }>
  esports_stats?: Array<{
    tournament: string
    pick_rate: number
    ban_rate: number
    win_rate: number
    date: string
  }>
}

interface ScrapedData {
  timestamp: string
  totalHeroes: number
  successful: number
  failed: number
  heroes: ScrapedHero[]
}

class ComprehensiveDataUploader {
  private dataPath: string
  private uploadedHeroes: Map<string, number> = new Map() // name -> hero_id mapping

  constructor() {
    this.dataPath = path.join(process.cwd(), 'scraped-data', 'heroes-data.json')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeSQL(sql: string): Promise<any[]> {
    try {
      const result = execSync(`npx wrangler d1 execute mlbb-tools-db --command "${sql}"`, {
        cwd: process.cwd(),
        encoding: 'utf-8',
        stdio: 'pipe'
      })
      
      // Extract JSON from wrangler output
      const lines = result.split('\n')
      for (const line of lines) {
        if (line.trim().startsWith('[') || line.trim().startsWith('{')) {
          try {
            return JSON.parse(line.trim())
          } catch {
            continue
          }
        }
      }
      
      // If no JSON found, return empty array
      return []
    } catch (error) {
      throw new Error(`SQL execution failed: ${error}`)
    }
  }

  private escapeSQLString(str: string): string {
    if (!str) return ''
    return str.replace(/'/g, "''").replace(/"/g, '""')
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

  async getExistingHeroIds(): Promise<void> {
    try {
      console.log('🔍 Getting existing hero IDs...')
      const result = await this.executeSQL("SELECT id, name FROM heroes ORDER BY name")
      
      if (result[0]?.results) {
        for (const hero of result[0].results) {
          this.uploadedHeroes.set(hero.name, hero.id)
        }
        console.log(`✅ Found ${this.uploadedHeroes.size} existing heroes`)
      }
    } catch (error) {
      console.error('❌ Failed to get existing heroes:', error)
      throw error
    }
  }

  async uploadHeroAbilities(hero: ScrapedHero, heroId: number): Promise<void> {
    if (!hero.abilities || hero.abilities.length === 0) return

    console.log(`  📝 Uploading ${hero.abilities.length} abilities for ${hero.basic_info.name}`)
    
    for (const ability of hero.abilities) {
      const sql = `INSERT OR REPLACE INTO abilities (
        hero_id, ability_type, name, description, cooldown, mana_cost,
        damage_scaling, ap_scaling, ad_scaling, range_value, area_effect, 
        additional_effects, icon_url
      ) VALUES (
        ${heroId}, 
        '${this.escapeSQLString(ability.ability_type)}',
        '${this.escapeSQLString(ability.name)}',
        '${this.escapeSQLString(ability.description)}',
        '${this.escapeSQLString(ability.cooldown || '')}',
        '${this.escapeSQLString(ability.mana_cost || '')}',
        '${this.escapeSQLString(ability.damage_scaling || '')}',
        '${this.escapeSQLString(ability.ap_scaling || '')}',
        '${this.escapeSQLString(ability.ad_scaling || '')}',
        '${this.escapeSQLString(ability.range_value || '')}',
        '${this.escapeSQLString(ability.area_effect || '')}',
        '${this.escapeSQLString(ability.additional_effects || '')}',
        '${this.escapeSQLString(ability.icon_url || '')}'
      );`

      try {
        await this.executeSQL(sql)
      } catch (error) {
        console.error(`    ❌ Failed to upload ability ${ability.name}:`, error)
      }
    }
  }

  async uploadHeroStats(hero: ScrapedHero, heroId: number): Promise<void> {
    if (!hero.stats) return

    console.log(`  📊 Uploading stats for ${hero.basic_info.name}`)
    
    const stats = hero.stats
    const sql = `INSERT OR REPLACE INTO base_stats (
      hero_id, level, hp, mana, attack, defense, magic_defense,
      move_speed, attack_speed, crit_rate, regen_hp, regen_mana
    ) VALUES (
      ${heroId},
      ${stats.level || 1},
      ${stats.hp || 'NULL'},
      ${stats.mana || 'NULL'},
      ${stats.attack || 'NULL'},
      ${stats.defense || 'NULL'},
      ${stats.magic_defense || 'NULL'},
      ${stats.move_speed || 'NULL'},
      ${stats.attack_speed || 'NULL'},
      ${stats.crit_rate || 'NULL'},
      '${this.escapeSQLString(stats.regen_hp || '')}',
      '${this.escapeSQLString(stats.regen_mana || '')}'
    );`

    try {
      await this.executeSQL(sql)
    } catch (error) {
      console.error(`    ❌ Failed to upload stats for ${hero.basic_info.name}:`, error)
    }
  }

  async uploadHeroLore(hero: ScrapedHero, heroId: number): Promise<void> {
    if (!hero.lore) return

    console.log(`  📚 Uploading lore for ${hero.basic_info.name}`)
    
    const lore = hero.lore
    const sql = `INSERT OR REPLACE INTO lore (
      hero_id, background, detailed_story, relationships, quotes, trivia
    ) VALUES (
      ${heroId},
      '${this.escapeSQLString(lore.background || '')}',
      '${this.escapeSQLString(lore.detailed_story || '')}',
      '${this.escapeSQLString(JSON.stringify(lore.relationships || []))}',
      '${this.escapeSQLString(JSON.stringify(lore.quotes || []))}',
      '${this.escapeSQLString(JSON.stringify(lore.trivia || []))}'
    );`

    try {
      await this.executeSQL(sql)
    } catch (error) {
      console.error(`    ❌ Failed to upload lore for ${hero.basic_info.name}:`, error)
    }
  }

  async uploadHeroPatches(hero: ScrapedHero, heroId: number): Promise<void> {
    if (!hero.patches || hero.patches.length === 0) return

    console.log(`  🔄 Uploading ${hero.patches.length} patches for ${hero.basic_info.name}`)
    
    for (const patch of hero.patches) {
      const sql = `INSERT OR REPLACE INTO patches (
        hero_id, patch_version, change_type, description, date
      ) VALUES (
        ${heroId},
        '${this.escapeSQLString(patch.patch_version)}',
        '${this.escapeSQLString(patch.change_type)}',
        '${this.escapeSQLString(patch.description)}',
        '${this.escapeSQLString(patch.date || '')}'
      );`

      try {
        await this.executeSQL(sql)
      } catch (error) {
        console.error(`    ❌ Failed to upload patch ${patch.patch_version}:`, error)
      }
    }
  }

  async uploadHeroEsportsStats(hero: ScrapedHero, heroId: number): Promise<void> {
    if (!hero.esports_stats || hero.esports_stats.length === 0) return

    console.log(`  🏆 Uploading ${hero.esports_stats.length} esports stats for ${hero.basic_info.name}`)
    
    for (const stat of hero.esports_stats) {
      const sql = `INSERT OR REPLACE INTO esports_stats (
        hero_id, tournament, pick_rate, ban_rate, win_rate, date
      ) VALUES (
        ${heroId},
        '${this.escapeSQLString(stat.tournament)}',
        ${stat.pick_rate},
        ${stat.ban_rate},
        ${stat.win_rate},
        '${this.escapeSQLString(stat.date)}'
      );`

      try {
        await this.executeSQL(sql)
      } catch (error) {
        console.error(`    ❌ Failed to upload esports stat for ${stat.tournament}:`, error)
      }
    }
  }

  async uploadCompleteHeroData(hero: ScrapedHero): Promise<void> {
    const heroId = this.uploadedHeroes.get(hero.basic_info.name)
    
    if (!heroId) {
      console.log(`⚠️ Hero ${hero.basic_info.name} not found in database, skipping detailed data`)
      return
    }

    console.log(`🚀 Uploading complete data for ${hero.basic_info.name} (ID: ${heroId})`)

    // Upload all related data
    await this.uploadHeroAbilities(hero, heroId)
    await this.uploadHeroStats(hero, heroId)
    await this.uploadHeroLore(hero, heroId)
    await this.uploadHeroPatches(hero, heroId)
    await this.uploadHeroEsportsStats(hero, heroId)
  }

  async uploadAllData(batchSize: number = 5): Promise<void> {
    try {
      console.log('🚀 Starting comprehensive data upload...')
      
      const data = await this.loadScrapedData()
      await this.getExistingHeroIds()
      
      let processed = 0
      let successful = 0
      let failed = 0

      for (let i = 0; i < data.heroes.length; i += batchSize) {
        const batch = data.heroes.slice(i, i + batchSize)
        console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} heroes)`)
        
        for (const hero of batch) {
          try {
            await this.uploadCompleteHeroData(hero)
            successful++
            console.log(`   ✅ ${hero.basic_info.name} - Complete`)
          } catch (error) {
            failed++
            console.log(`   ❌ ${hero.basic_info.name} - Failed: ${error}`)
          }
          processed++
        }
        
        // Wait between batches
        if (i + batchSize < data.heroes.length) {
          console.log('   ⏳ Waiting 3s before next batch...')
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      }

      console.log('\n🎉 Upload completed!')
      console.log(`   ✅ Successful: ${successful}`)
      console.log(`   ❌ Failed: ${failed}`)
      console.log(`   📊 Total processed: ${processed}`)

      // Final verification
      await this.verifyUpload()

    } catch (error) {
      console.error('❌ Upload failed:', error)
      process.exit(1)
    }
  }

  async verifyUpload(): Promise<void> {
    console.log('\n🔍 Verifying upload...')
    
    try {
      const tables = ['heroes', 'abilities', 'base_stats', 'lore', 'patches', 'esports_stats']
      
      for (const table of tables) {
        const result = await this.executeSQL(`SELECT COUNT(*) as count FROM ${table}`)
        const count = result[0]?.results?.[0]?.count || 0
        console.log(`   📊 ${table}: ${count} records`)
      }
    } catch (error) {
      console.error('❌ Verification failed:', error)
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const batchSize = parseInt(args[0]) || 5

  console.log('🛠️ Comprehensive MLBB Data Uploader')
  console.log(`📦 Batch size: ${batchSize}`)
  console.log('📋 Will upload: Heroes, Abilities, Stats, Lore, Patches, Esports Stats\n')

  const uploader = new ComprehensiveDataUploader()
  await uploader.uploadAllData(batchSize)
}

if (require.main === module) {
  main().catch(console.error)
}

#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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

class FullDataUploader {
  private dataPath: string
  private heroIdMap: Map<string, number> = new Map()

  constructor() {
    this.dataPath = path.join(process.cwd(), 'scraped-data', 'heroes-data.json')
  }

  private escapeSQLString(str: string | undefined): string {
    if (!str) return ''
    // Escape single quotes and backslashes for SQL
    return str.replace(/'/g, "''").replace(/\\/g, '\\\\').replace(/"/g, '""')
  }

  private async executeSQL(sql: string, description: string): Promise<boolean> {
    try {
      // Write SQL to a temporary file to avoid command line issues
      const tempFile = path.join(process.cwd(), 'temp-sql.sql')
      fs.writeFileSync(tempFile, sql)
      
      execSync(`npx wrangler d1 execute mlbb-tools-db --file="${tempFile}"`, {
        cwd: process.cwd(),
        stdio: 'pipe'
      })
      
      // Clean up temp file
      fs.unlinkSync(tempFile)
      return true
    } catch (error) {
      console.log(`    ❌ Failed to ${description}: ${error}`)
      return false
    }
  }

  async loadScrapedData(): Promise<ScrapedData> {
    if (!fs.existsSync(this.dataPath)) {
      throw new Error(`Data file not found: ${this.dataPath}`)
    }

    const fileContent = fs.readFileSync(this.dataPath, 'utf-8')
    const data: ScrapedData = JSON.parse(fileContent)
    
    console.log(`📁 Loaded ${data.heroes.length} heroes from scraped data`)
    console.log(`📊 Data timestamp: ${data.timestamp}`)
    console.log(`✅ Successful scrapes: ${data.successful}`)
    console.log(`❌ Failed scrapes: ${data.failed}`)
    
    return data
  }

  async buildHeroIdMap(): Promise<void> {
    console.log('\n🔍 Building hero ID mapping...')
    
    try {
      const result = execSync('npx wrangler d1 execute mlbb-tools-db --command "SELECT id, name FROM heroes ORDER BY name;"', {
        cwd: process.cwd(),
        encoding: 'utf-8'
      })

      // Parse the JSON output from wrangler
      const lines = result.split('\n')
      
      // Find the JSON part of the output
      let jsonStartIndex = -1
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '[') {
          jsonStartIndex = i
          break
        }
      }
      
      if (jsonStartIndex === -1) {
        throw new Error('Could not find JSON output in wrangler response')
      }
      
      // Extract JSON from the remaining lines
      const jsonLines = lines.slice(jsonStartIndex)
      const jsonString = jsonLines.join('\n')
      
      try {
        const parsed = JSON.parse(jsonString)
        
        if (parsed && parsed[0] && parsed[0].results) {
          for (const hero of parsed[0].results) {
            if (hero.id && hero.name) {
              this.heroIdMap.set(hero.name, hero.id)
            }
          }
        }
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError)
        console.log('Raw output:')
        console.log('================')
        console.log(result)
        console.log('================')
        throw parseError
      }
      
      console.log(`✅ Found ${this.heroIdMap.size} heroes in database`)
      
      // Show sample mappings
      const sampleHeroes = Array.from(this.heroIdMap.entries()).slice(0, 5)
      console.log('📋 Sample hero mappings:')
      for (const [name, id] of sampleHeroes) {
        console.log(`   ${name} -> ID ${id}`)
      }
      
      if (this.heroIdMap.size === 0) {
        console.log('Raw output:')
        console.log('================')
        console.log(result)
        console.log('================')
        throw new Error('No heroes found in database. Please ensure heroes are imported first.')
      }
      
    } catch (error) {
      console.error('❌ Failed to build hero ID map:', error)
      throw error
    }
  }

  async uploadHeroAbilities(hero: ScrapedHero): Promise<number> {
    if (!hero.abilities || hero.abilities.length === 0) return 0

    const heroId = this.heroIdMap.get(hero.basic_info.name)
    if (!heroId) return 0

    let uploaded = 0
    
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
        '${this.escapeSQLString(ability.cooldown)}',
        '${this.escapeSQLString(ability.mana_cost)}',
        '${this.escapeSQLString(ability.damage_scaling)}',
        '${this.escapeSQLString(ability.ap_scaling)}',
        '${this.escapeSQLString(ability.ad_scaling)}',
        '${this.escapeSQLString(ability.range_value)}',
        '${this.escapeSQLString(ability.area_effect)}',
        '${this.escapeSQLString(ability.additional_effects)}',
        '${this.escapeSQLString(ability.icon_url)}'
      );`

      if (await this.executeSQL(sql, `upload ability ${ability.name}`)) {
        uploaded++
      }
    }
    
    return uploaded
  }

  async uploadHeroStats(hero: ScrapedHero): Promise<boolean> {
    if (!hero.stats) return false

    const heroId = this.heroIdMap.get(hero.basic_info.name)
    if (!heroId) return false

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
      '${this.escapeSQLString(stats.regen_hp)}',
      '${this.escapeSQLString(stats.regen_mana)}'
    );`

    return await this.executeSQL(sql, 'upload hero stats')
  }

  async uploadHeroLore(hero: ScrapedHero): Promise<boolean> {
    if (!hero.lore) return false

    const heroId = this.heroIdMap.get(hero.basic_info.name)
    if (!heroId) return false

    const lore = hero.lore
    const sql = `INSERT OR REPLACE INTO lore (
      hero_id, background, detailed_story, relationships, quotes, trivia
    ) VALUES (
      ${heroId},
      '${this.escapeSQLString(lore.background)}',
      '${this.escapeSQLString(lore.detailed_story)}',
      '${this.escapeSQLString(JSON.stringify(lore.relationships || []))}',
      '${this.escapeSQLString(JSON.stringify(lore.quotes || []))}',
      '${this.escapeSQLString(JSON.stringify(lore.trivia || []))}'
    );`

    return await this.executeSQL(sql, 'upload hero lore')
  }

  async uploadHeroPatches(hero: ScrapedHero): Promise<number> {
    if (!hero.patches || hero.patches.length === 0) return 0

    const heroId = this.heroIdMap.get(hero.basic_info.name)
    if (!heroId) return 0

    let uploaded = 0
    
    for (const patch of hero.patches) {
      const sql = `INSERT OR REPLACE INTO patches (
        hero_id, patch_version, change_type, description, date
      ) VALUES (
        ${heroId},
        '${this.escapeSQLString(patch.patch_version)}',
        '${this.escapeSQLString(patch.change_type)}',
        '${this.escapeSQLString(patch.description)}',
        '${this.escapeSQLString(patch.date)}'
      );`

      if (await this.executeSQL(sql, `upload patch ${patch.patch_version}`)) {
        uploaded++
      }
    }
    
    return uploaded
  }

  async uploadHeroEsportsStats(hero: ScrapedHero): Promise<number> {
    if (!hero.esports_stats || hero.esports_stats.length === 0) return 0

    const heroId = this.heroIdMap.get(hero.basic_info.name)
    if (!heroId) return 0

    let uploaded = 0
    
    for (const stat of hero.esports_stats) {
      const sql = `INSERT OR REPLACE INTO esports_stats (
        hero_id, tournament, pick_rate, ban_rate, win_rate, date
      ) VALUES (
        ${heroId},
        '${this.escapeSQLString(stat.tournament)}',
        ${stat.pick_rate || 0},
        ${stat.ban_rate || 0},
        ${stat.win_rate || 0},
        '${this.escapeSQLString(stat.date)}'
      );`

      if (await this.executeSQL(sql, `upload esports stat for ${stat.tournament}`)) {
        uploaded++
      }
    }
    
    return uploaded
  }

  async processHero(hero: ScrapedHero): Promise<{
    abilities: number
    stats: boolean
    lore: boolean
    patches: number
    esports: number
  }> {
    const heroId = this.heroIdMap.get(hero.basic_info.name)
    
    if (!heroId) {
      console.log(`⚠️ Skipping ${hero.basic_info.name} - not found in database`)
      return { abilities: 0, stats: false, lore: false, patches: 0, esports: 0 }
    }

    console.log(`🚀 Processing ${hero.basic_info.name} (ID: ${heroId})`)

    const results = {
      abilities: await this.uploadHeroAbilities(hero),
      stats: await this.uploadHeroStats(hero),
      lore: await this.uploadHeroLore(hero),
      patches: await this.uploadHeroPatches(hero),
      esports: await this.uploadHeroEsportsStats(hero)
    }

    console.log(`   ✅ Abilities: ${results.abilities}, Stats: ${results.stats ? 'Yes' : 'No'}, Lore: ${results.lore ? 'Yes' : 'No'}, Patches: ${results.patches}, Esports: ${results.esports}`)

    return results
  }

  async uploadAllData(batchSize: number = 10): Promise<void> {
    try {
      console.log('🚀 Starting FULL DATA POPULATION...')
      console.log(`📦 Batch size: ${batchSize}`)
      console.log('📋 Will upload: Abilities, Stats, Lore, Patches, Esports Stats\n')
      
      const data = await this.loadScrapedData()
      await this.buildHeroIdMap()
      
      // Track overall progress
      const totals = {
        heroes: 0,
        abilities: 0,
        stats: 0,
        lore: 0,
        patches: 0,
        esports: 0
      }

      // Process heroes in batches
      for (let i = 0; i < data.heroes.length; i += batchSize) {
        const batch = data.heroes.slice(i, i + batchSize)
        const batchNum = Math.floor(i / batchSize) + 1
        const totalBatches = Math.ceil(data.heroes.length / batchSize)
        
        console.log(`\n📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} heroes)`)
        
        for (const hero of batch) {
          const results = await this.processHero(hero)
          
          totals.heroes++
          totals.abilities += results.abilities
          totals.stats += results.stats ? 1 : 0
          totals.lore += results.lore ? 1 : 0
          totals.patches += results.patches
          totals.esports += results.esports
        }
        
        // Progress update
        console.log(`   📊 Batch ${batchNum} complete - Processed ${Math.min(i + batchSize, data.heroes.length)}/${data.heroes.length} heroes`)
        
        // Wait between batches to avoid overwhelming the database
        if (i + batchSize < data.heroes.length) {
          console.log('   ⏳ Waiting 3s before next batch...')
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      }

      // Final summary
      console.log('\n🎉 FULL DATA POPULATION COMPLETED!')
      console.log('═══════════════════════════════════')
      console.log(`📊 Final Statistics:`)
      console.log(`   Heroes processed: ${totals.heroes}`)
      console.log(`   Abilities uploaded: ${totals.abilities}`)
      console.log(`   Hero stats uploaded: ${totals.stats}`)
      console.log(`   Lore entries uploaded: ${totals.lore}`)
      console.log(`   Patch records uploaded: ${totals.patches}`)
      console.log(`   Esports stats uploaded: ${totals.esports}`)

      // Final verification
      await this.verifyUpload()

    } catch (error) {
      console.error('❌ Full data upload failed:', error)
      process.exit(1)
    }
  }

  async verifyUpload(): Promise<void> {
    console.log('\n🔍 Verifying database state...')
    
    try {
      const tables = ['heroes', 'abilities', 'base_stats', 'lore', 'patches', 'esports_stats']
      
      for (const table of tables) {
        const result = execSync(`npx wrangler d1 execute mlbb-tools-db --command "SELECT COUNT(*) as count FROM ${table};"`, {
          cwd: process.cwd(),
          encoding: 'utf-8'
        })
        
        // Extract count from wrangler output
        const lines = result.split('\n')
        for (const line of lines) {
          if (line.trim().startsWith('[')) {
            try {
              const jsonData = JSON.parse(line.trim())
              const count = jsonData[0]?.results?.[0]?.count || 0
              console.log(`   📊 ${table}: ${count} records`)
              break
            } catch {
              continue
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Verification failed:', error)
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const batchSize = parseInt(args[0]) || 10

  console.log('🛠️ MLBB FULL DATA POPULATION TOOL')
  console.log('═══════════════════════════════════')
  console.log(`⚙️ Configuration:`)
  console.log(`   Batch size: ${batchSize}`)
  console.log(`   Target: All hero data (abilities, stats, lore, patches, esports)`)
  console.log(`   Database: Local D1 database\n`)

  const uploader = new FullDataUploader()
  await uploader.uploadAllData(batchSize)
}

if (require.main === module) {
  main().catch(console.error)
}

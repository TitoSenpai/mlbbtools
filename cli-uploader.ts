#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface HeroData {
  basic_info: {
    name: string
    role: string
    slug: string
    image_url?: string
    thumbnail_url?: string
  }
  abilities: Array<{
    ability_type: 'Passive' | 'Skill1' | 'Skill2' | 'Ultimate'
    name: string
    description: string
    cooldown?: string
    mana_cost?: string
  }>
}

interface ScrapedData {
  timestamp: string
  totalHeroes: number
  successful: number
  failed: number
  heroes: HeroData[]
}

class CLIDatabaseUploader {
  private dataPath: string

  constructor() {
    this.dataPath = path.join(process.cwd(), 'scraped-data', 'heroes-data.json')
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

  private sanitizeForSQL(str: string): string {
    return str.replace(/'/g, "''").replace(/\n/g, ' ').replace(/\r/g, '')
  }

  private createHeroSQL(hero: HeroData): string {
    const name = this.sanitizeForSQL(hero.basic_info.name)
    const role = hero.basic_info.role === 'Unknown' ? 'Fighter' : hero.basic_info.role
    const imageUrl = hero.basic_info.image_url || ''
    
    return `INSERT OR REPLACE INTO heroes (name, role, image_url) VALUES ('${name}', '${role}', '${imageUrl}');`
  }

  private createAbilitySQL(hero: HeroData, ability: HeroData['abilities'][0]): string {
    const heroName = this.sanitizeForSQL(hero.basic_info.name)
    const abilityName = this.sanitizeForSQL(
      ability.name === 'Ability Type' ? `${hero.basic_info.name} ${ability.ability_type}` : ability.name
    )
    const description = this.sanitizeForSQL(ability.description)
    const type = ability.ability_type.toLowerCase()
    const cooldown = ability.cooldown ? `'${this.sanitizeForSQL(ability.cooldown)}'` : 'NULL'
    const manaCost = ability.mana_cost ? `'${this.sanitizeForSQL(ability.mana_cost)}'` : 'NULL'
    
    return `INSERT OR REPLACE INTO abilities (hero_name, name, type, description, cooldown, mana_cost) VALUES ('${heroName}', '${abilityName}', '${type}', '${description}', ${cooldown}, ${manaCost});`
  }

  async uploadBatch(heroes: HeroData[], batchNumber: number): Promise<void> {
    try {
      console.log(`\n📦 Processing batch ${batchNumber} (${heroes.length} heroes)`)
      
      // Create SQL commands for this batch
      const commands: string[] = []
      
      for (const hero of heroes) {
        // Add hero
        commands.push(this.createHeroSQL(hero))
        
        // Add abilities
        for (const ability of hero.abilities) {
          commands.push(this.createAbilitySQL(hero, ability))
        }
      }

      console.log(`📝 Generated ${commands.length} SQL commands`)
      
      // Execute commands one by one (to avoid timeout issues)
      let successCount = 0
      let failureCount = 0
      
      for (let i = 0; i < commands.length; i++) {
        try {
          const command = `wrangler d1 execute mlbb-tools-db --command="${commands[i]}" --remote`
          execSync(command, { stdio: 'pipe' })
          successCount++
          
          if ((i + 1) % 10 === 0) {
            console.log(`   ⏳ Progress: ${i + 1}/${commands.length} commands executed`)
          }
        } catch {
          console.log(`   ❌ Failed command ${i + 1}: ${commands[i].substring(0, 50)}...`)
          failureCount++
        }
        
        // Small delay to avoid overwhelming the API
        if (i < commands.length - 1) {
          await this.sleep(100)
        }
      }
      
      console.log(`✅ Batch ${batchNumber} completed: ${successCount} successful, ${failureCount} failed`)
    } catch (error) {
      console.error(`❌ Batch ${batchNumber} failed:`, error)
      throw error
    }
  }

  async uploadAllHeroes(data: ScrapedData, batchSize: number = 5): Promise<void> {
    console.log(`🚀 Starting CLI database upload...`)
    console.log(`📊 Total heroes to upload: ${data.heroes.length}`)
    console.log(`📦 Batch size: ${batchSize}`)

    const batches = this.createBatches(data.heroes, batchSize)
    let totalSuccess = 0
    let totalFailure = 0

    for (let i = 0; i < batches.length; i++) {
      try {
        await this.uploadBatch(batches[i], i + 1)
        totalSuccess += batches[i].length
        
        // Wait between batches
        if (i < batches.length - 1) {
          console.log(`⏳ Waiting 5s before next batch...`)
          await this.sleep(5000)
        }
      } catch {
        console.error(`❌ Batch ${i + 1} failed completely`)
        totalFailure += batches[i].length
      }
    }

    // Final summary
    console.log(`\n🎉 Upload completed!`)
    console.log(`📊 Final results:`)
    console.log(`  - Total heroes processed: ${data.heroes.length}`)
    console.log(`  - Successful uploads: ${totalSuccess}`)
    console.log(`  - Failed uploads: ${totalFailure}`)
    console.log(`  - Success rate: ${((totalSuccess / data.heroes.length) * 100).toFixed(1)}%`)
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }
    return batches
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async testDatabase(): Promise<void> {
    try {
      console.log(`🧪 Testing database connection...`)
      
      const testCommand = `wrangler d1 execute mlbb-tools-db --command="SELECT COUNT(*) as hero_count FROM heroes;" --remote`
      const result = execSync(testCommand, { encoding: 'utf-8' })
      
      console.log(`✅ Database connection successful!`)
      console.log(`📊 Current heroes in database:`)
      console.log(result)
    } catch (error) {
      console.error(`❌ Database connection failed:`, error)
      throw error
    }
  }
}

async function main() {
  const command = process.argv[2]
  const uploader = new CLIDatabaseUploader()

  try {
    switch (command) {
      case 'test':
        await uploader.testDatabase()
        break

      case 'upload':
        const batchSize = parseInt(process.argv[3]) || 5
        console.log(`📤 Starting CLI upload with batch size: ${batchSize}`)
        
        const data = await uploader.loadScrapedData()
        await uploader.uploadAllHeroes(data, batchSize)
        break

      default:
        console.log(`🛠️ CLI Database Uploader Commands:`)
        console.log(`  test     - Test connection to production database`)
        console.log(`  upload   - Upload all heroes using CLI commands`)
        console.log(``)
        console.log(`Examples:`)
        console.log(`  npx tsx cli-uploader.ts test`)
        console.log(`  npx tsx cli-uploader.ts upload 5`)
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

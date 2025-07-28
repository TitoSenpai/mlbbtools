// Local scraping script for MLBB hero data collection
// Runs independently of the web application for data gathering

import fs from 'fs/promises'
import path from 'path'
import { LiquipediaScraper, type ComprehensiveHeroData } from './src/lib/scraping/liquipedia-scraper'

interface LocalScrapingResults {
  timestamp: string
  totalHeroes: number
  successful: number
  failed: number
  heroes: ComprehensiveHeroData[]
  errors: Array<{ hero: string; error: string }>
}

class LocalScraper {
  private scraper: LiquipediaScraper
  private outputDir: string
  private resultsFile: string

  constructor() {
    this.scraper = new LiquipediaScraper()
    this.outputDir = path.join(process.cwd(), 'scraped-data')
    this.resultsFile = path.join(this.outputDir, 'heroes-data.json')
  }

  async init() {
    // Create output directory if it doesn't exist
    try {
      await fs.mkdir(this.outputDir, { recursive: true })
      console.log(`📁 Created output directory: ${this.outputDir}`)
    } catch {
      console.log(`📁 Output directory already exists: ${this.outputDir}`)
    }
  }

  async scrapeAllHeroes(options: {
    maxHeroes?: number
    skipExisting?: boolean
    batchSize?: number
    delayBetweenBatches?: number
  } = {}) {
    const {
      maxHeroes = 50,
      skipExisting = true,
      batchSize = 5,
      delayBetweenBatches = 10000 // 10 seconds
    } = options

    console.log('🚀 Starting local MLBB hero scraping...')
    console.log(`📊 Settings: maxHeroes=${maxHeroes}, batchSize=${batchSize}`)

    const results: LocalScrapingResults = {
      timestamp: new Date().toISOString(),
      totalHeroes: 0,
      successful: 0,
      failed: 0,
      heroes: [],
      errors: []
    }

    try {
      // Step 1: Get list of all heroes
      console.log('🔍 Discovering heroes from Liquipedia...')
      const heroListResult = await this.scraper.scrapeHeroList()
      
      if (!heroListResult.success || !heroListResult.data) {
        throw new Error(`Failed to get hero list: ${heroListResult.error}`)
      }

      let heroList = heroListResult.data.slice(0, maxHeroes)
      console.log(`✅ Found ${heroList.length} heroes to scrape`)

      // Step 2: Load existing data if skipExisting is true
      let existingData: ComprehensiveHeroData[] = []
      if (skipExisting) {
        try {
          const existingFile = await fs.readFile(this.resultsFile, 'utf-8')
          const existingResults = JSON.parse(existingFile) as LocalScrapingResults
          existingData = existingResults.heroes || []
          
          const existingHeroNames = new Set(existingData.map(h => h.basic_info.name.toLowerCase()))
          heroList = heroList.filter(hero => !existingHeroNames.has(hero.toLowerCase()))
          
          console.log(`📋 Found ${existingData.length} existing heroes, ${heroList.length} new to scrape`)
          results.heroes = existingData
          results.successful = existingData.length
        } catch {
          console.log('📋 No existing data found, starting fresh')
        }
      }

      if (heroList.length === 0) {
        console.log('✅ All heroes already scraped!')
        return results
      }

      // Step 3: Process heroes in batches
      for (let i = 0; i < heroList.length; i += batchSize) {
        const batch = heroList.slice(i, i + batchSize)
        const batchNum = Math.floor(i / batchSize) + 1
        const totalBatches = Math.ceil(heroList.length / batchSize)
        
        console.log(`\n📦 Processing batch ${batchNum}/${totalBatches}: ${batch.join(', ')}`)

        // Process batch in parallel
        const batchPromises = batch.map(async (heroName) => {
          try {
            console.log(`  🔍 Scraping ${heroName}...`)
            const result = await this.scraper.scrapeHeroData(heroName)
            
            if (result.success && result.data) {
              console.log(`  ✅ ${heroName} - Success`)
              return { success: true, data: result.data }
            } else {
              console.log(`  ❌ ${heroName} - Failed: ${result.error}`)
              return { success: false, error: result.error || 'Unknown error', heroName }
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error'
            console.log(`  ❌ ${heroName} - Exception: ${errorMsg}`)
            return { success: false, error: errorMsg, heroName }
          }
        })

        // Wait for batch to complete
        const batchResults = await Promise.all(batchPromises)
        
        // Process results
        for (const result of batchResults) {
          results.totalHeroes++
          if (result.success && 'data' in result && result.data) {
            results.successful++
            results.heroes.push(result.data)
          } else if ('heroName' in result && result.heroName && result.error) {
            results.failed++
            results.errors.push({
              hero: result.heroName,
              error: result.error
            })
          }
        }

        // Save progress after each batch
        await this.saveResults(results)
        console.log(`💾 Progress saved. Success: ${results.successful}, Failed: ${results.failed}`)

        // Delay between batches (except for the last one)
        if (i + batchSize < heroList.length) {
          console.log(`⏳ Waiting ${delayBetweenBatches/1000}s before next batch...`)
          await this.delay(delayBetweenBatches)
        }
      }

      console.log('\n🎉 Scraping completed!')
      console.log(`📊 Final results:`)
      console.log(`  - Total heroes processed: ${results.totalHeroes}`)
      console.log(`  - Successful: ${results.successful}`)
      console.log(`  - Failed: ${results.failed}`)
      console.log(`  - Success rate: ${((results.successful / (results.successful + results.failed)) * 100).toFixed(1)}%`)

      if (results.errors.length > 0) {
        console.log(`\n❌ Failed heroes:`)
        results.errors.forEach(error => {
          console.log(`  - ${error.hero}: ${error.error}`)
        })
      }

      return results

    } catch (error) {
      console.error('💥 Fatal error during scraping:', error)
      throw error
    }
  }

  async saveResults(results: LocalScrapingResults) {
    try {
      const jsonData = JSON.stringify(results, null, 2)
      await fs.writeFile(this.resultsFile, jsonData, 'utf-8')
      
      // Also save individual hero files for easier debugging
      const heroesDir = path.join(this.outputDir, 'individual-heroes')
      await fs.mkdir(heroesDir, { recursive: true })
      
      for (const hero of results.heroes) {
        const heroFile = path.join(heroesDir, `${hero.basic_info.slug || hero.basic_info.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`)
        await fs.writeFile(heroFile, JSON.stringify(hero, null, 2), 'utf-8')
      }
      
    } catch {
      console.error('❌ Failed to save results')
    }
  }

  async loadExistingResults(): Promise<LocalScrapingResults | null> {
    try {
      const data = await fs.readFile(this.resultsFile, 'utf-8')
      return JSON.parse(data) as LocalScrapingResults
    } catch (error) {
      return null
    }
  }

  async generateSummaryReport() {
    const results = await this.loadExistingResults()
    if (!results) {
      console.log('❌ No scraped data found')
      return
    }

    console.log('\n📊 MLBB Hero Data Summary Report')
    console.log('=====================================')
    console.log(`🕐 Last updated: ${new Date(results.timestamp).toLocaleString()}`)
    console.log(`📈 Total heroes: ${results.heroes.length}`)
    console.log(`✅ Success rate: ${((results.successful / (results.successful + results.failed)) * 100).toFixed(1)}%`)

    // Role distribution
    const roleCount = results.heroes.reduce((acc, hero) => {
      const role = hero.basic_info.role || 'Unknown'
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('\n🎭 Heroes by Role:')
    Object.entries(roleCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([role, count]) => {
        console.log(`  ${role}: ${count}`)
      })

    // Lane distribution
    const laneCount = results.heroes.reduce((acc, hero) => {
      const lane = hero.basic_info.lane || 'Unknown'
      acc[lane] = (acc[lane] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('\n🛣️ Heroes by Lane:')
    Object.entries(laneCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([lane, count]) => {
        console.log(`  ${lane}: ${count}`)
      })

    // Data completeness
    const withImages = results.heroes.filter(h => h.basic_info.image_url).length
    const withAbilities = results.heroes.filter(h => h.abilities.length > 0).length
    const withLore = results.heroes.filter(h => h.lore.background).length
    const withPatches = results.heroes.filter(h => h.patches.length > 0).length

    console.log('\n📋 Data Completeness:')
    console.log(`  Heroes with images: ${withImages}/${results.heroes.length} (${((withImages/results.heroes.length)*100).toFixed(1)}%)`)
    console.log(`  Heroes with abilities: ${withAbilities}/${results.heroes.length} (${((withAbilities/results.heroes.length)*100).toFixed(1)}%)`)
    console.log(`  Heroes with lore: ${withLore}/${results.heroes.length} (${((withLore/results.heroes.length)*100).toFixed(1)}%)`)
    console.log(`  Heroes with patch data: ${withPatches}/${results.heroes.length} (${((withPatches/results.heroes.length)*100).toFixed(1)}%)`)

    if (results.errors.length > 0) {
      console.log(`\n❌ Failed Heroes (${results.errors.length}):`)
      results.errors.forEach(error => {
        console.log(`  - ${error.hero}: ${error.error}`)
      })
    }

    console.log(`\n💾 Data saved to: ${this.outputDir}`)
    console.log(`📄 Main file: heroes-data.json`)
    console.log(`📁 Individual files: individual-heroes/`)
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// CLI interface
async function main() {
  const scraper = new LocalScraper()
  await scraper.init()

  const args = process.argv.slice(2)
  const command = args[0] || 'scrape'

  switch (command) {
    case 'scrape':
      const maxHeroes = parseInt(args[1]) || 50
      const batchSize = parseInt(args[2]) || 5
      console.log(`🎯 Starting scrape with maxHeroes=${maxHeroes}, batchSize=${batchSize}`)
      
      await scraper.scrapeAllHeroes({
        maxHeroes,
        batchSize,
        skipExisting: true,
        delayBetweenBatches: 10000
      })
      break

    case 'report':
      await scraper.generateSummaryReport()
      break

    case 'continue':
      console.log('🔄 Continuing previous scraping session...')
      await scraper.scrapeAllHeroes({
        maxHeroes: 200, // Large number to get all remaining
        batchSize: 3,
        skipExisting: true,
        delayBetweenBatches: 8000
      })
      break

    default:
      console.log('Usage:')
      console.log('  npm run scrape-local [maxHeroes] [batchSize]  - Start scraping')
      console.log('  npm run scrape-local report                   - Generate report')
      console.log('  npm run scrape-local continue                 - Continue previous session')
      break
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { LocalScraper, type LocalScrapingResults }

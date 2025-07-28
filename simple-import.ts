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
}

interface ScrapedData {
  timestamp: string
  totalHeroes: number
  successful: number
  failed: number
  heroes: ScrapedHero[]
}

async function importHeroes() {
  try {
    console.log('🚀 Starting hero import...')
    
    // Load scraped data
    const dataPath = path.join(process.cwd(), 'scraped-data', 'heroes-data.json')
    const fileContent = fs.readFileSync(dataPath, 'utf-8')
    const data: ScrapedData = JSON.parse(fileContent)
    
    console.log(`📁 Found ${data.heroes.length} heroes to import`)
    
    // Process heroes in batches
    const batchSize = 5
    let imported = 0
    let failed = 0
    
    for (let i = 0; i < data.heroes.length; i += batchSize) {
      const batch = data.heroes.slice(i, i + batchSize)
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} heroes)`)
      
      for (const hero of batch) {
        try {
          // Clean the hero name for SQL
          const cleanName = hero.basic_info.name.replace(/'/g, "''")
          const cleanRole = hero.basic_info.role || 'Unknown'
          const cleanSlug = hero.basic_info.slug || cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')
          const imageUrl = hero.basic_info.image_url || hero.basic_info.thumbnail_url || ''
          
          const sql = `INSERT OR REPLACE INTO heroes (name, role, slug, image_url) VALUES ('${cleanName}', '${cleanRole}', '${cleanSlug}', '${imageUrl}');`
          
          execSync(`npx wrangler d1 execute mlbb-tools-db --command "${sql}"`, { 
            cwd: process.cwd(),
            stdio: 'pipe' 
          })
          
          imported++
          console.log(`   ✅ ${hero.basic_info.name}`)
          
        } catch (error) {
          failed++
          console.log(`   ❌ Failed to import ${hero.basic_info.name}: ${error}`)
        }
      }
      
      // Wait between batches to avoid overwhelming the database
      if (i + batchSize < data.heroes.length) {
        console.log('   ⏳ Waiting 2s before next batch...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    console.log(`\n🎉 Import completed!`)
    console.log(`   ✅ Successful: ${imported}`)
    console.log(`   ❌ Failed: ${failed}`)
    console.log(`   📊 Total: ${imported + failed}`)
    
    // Verify the import
    console.log('\n🔍 Verifying import...')
    const result = execSync('npx wrangler d1 execute mlbb-tools-db --command "SELECT COUNT(*) as count FROM heroes;"', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })
    console.log('Database result:', result)
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

// Run the import
importHeroes()

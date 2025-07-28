#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface ScrapedHero {
  basic_info: {
    name: string
  }
  abilities?: Array<{
    ability_type: 'Passive' | 'Skill1' | 'Skill2' | 'Ultimate'
    name: string
    description: string
    cooldown?: string
    mana_cost?: string
  }>
}

interface ScrapedData {
  heroes: ScrapedHero[]
}

async function uploadAbilities() {
  try {
    console.log('🚀 Starting abilities upload...')
    
    // Load scraped data
    const dataPath = path.join(process.cwd(), 'scraped-data', 'heroes-data.json')
    const fileContent = fs.readFileSync(dataPath, 'utf-8')
    const data: ScrapedData = JSON.parse(fileContent)
    
    console.log(`📁 Found ${data.heroes.length} heroes with ability data`)
    
    // Get hero mapping from database
    console.log('🔍 Getting hero IDs from database...')
    const heroResult = execSync('npx wrangler d1 execute mlbb-tools-db --command "SELECT id, name FROM heroes;"', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })
    
    // Parse heroes from wrangler output
    const heroMap = new Map<string, number>()
    const lines = heroResult.split('\n')
    let inTable = false
    
    for (const line of lines) {
      if (line.includes('├') || line.includes('┌') || line.includes('└')) {
        inTable = true
        continue
      }
      if (inTable && line.includes('│')) {
        const parts = line.split('│').map(p => p.trim()).filter(p => p)
        if (parts.length >= 2 && !isNaN(Number(parts[0]))) {
          const id = Number(parts[0])
          const name = parts[1]
          heroMap.set(name, id)
        }
      }
    }
    
    console.log(`✅ Found ${heroMap.size} heroes in database`)
    
    // Upload abilities for each hero
    let uploaded = 0
    let skipped = 0
    
    for (const hero of data.heroes) {
      const heroId = heroMap.get(hero.basic_info.name)
      
      if (!heroId) {
        console.log(`⚠️ Skipping ${hero.basic_info.name} - not found in database`)
        skipped++
        continue
      }
      
      if (!hero.abilities || hero.abilities.length === 0) {
        console.log(`⚠️ Skipping ${hero.basic_info.name} - no abilities data`)
        skipped++
        continue
      }
      
      console.log(`📝 Uploading ${hero.abilities.length} abilities for ${hero.basic_info.name}`)
      
      for (const ability of hero.abilities) {
        const cleanName = ability.name.replace(/'/g, "''")
        const cleanDesc = ability.description.replace(/'/g, "''")
        const cleanCooldown = (ability.cooldown || '').replace(/'/g, "''")
        const cleanMana = (ability.mana_cost || '').replace(/'/g, "''")
        
        const sql = `INSERT OR REPLACE INTO abilities (hero_id, ability_type, name, description, cooldown, mana_cost) VALUES (${heroId}, '${ability.ability_type}', '${cleanName}', '${cleanDesc}', '${cleanCooldown}', '${cleanMana}');`
        
        try {
          execSync(`npx wrangler d1 execute mlbb-tools-db --command "${sql}"`, {
            cwd: process.cwd(),
            stdio: 'pipe'
          })
        } catch (error) {
          console.log(`    ❌ Failed to upload ability: ${ability.name}`)
        }
      }
      
      uploaded++
      
      // Small delay to avoid overwhelming the database
      if (uploaded % 10 === 0) {
        console.log(`   ⏳ Processed ${uploaded} heroes, waiting 2s...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    console.log('\n🎉 Abilities upload completed!')
    console.log(`   ✅ Heroes processed: ${uploaded}`)
    console.log(`   ⚠️ Skipped: ${skipped}`)
    
    // Verify upload
    console.log('\n🔍 Verifying abilities upload...')
    const countResult = execSync('npx wrangler d1 execute mlbb-tools-db --command "SELECT COUNT(*) as count FROM abilities;"', {
      cwd: process.cwd(),
      encoding: 'utf-8'
    })
    
    console.log('Abilities count result:', countResult)
    
  } catch (error) {
    console.error('❌ Upload failed:', error)
    process.exit(1)
  }
}

uploadAbilities()

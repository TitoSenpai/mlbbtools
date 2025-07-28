#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// Simple script to upload a few abilities as test
async function uploadSampleAbilities() {
  try {
    console.log('🚀 Uploading sample abilities...')
    
    // Test with a few specific heroes we know exist
    const testHeroes = [
      { name: 'Alucard', id: 5 },
      { name: 'Miya', id: 20 },
      { name: 'Eudora', id: 15 }
    ]
    
    for (const hero of testHeroes) {
      console.log(`📝 Adding sample abilities for ${hero.name} (ID: ${hero.id})`)
      
      // Add a passive ability
      const sql1 = `INSERT OR REPLACE INTO abilities (hero_id, ability_type, name, description) VALUES (${hero.id}, 'Passive', '${hero.name} Passive', 'Sample passive ability for ${hero.name}');`
      
      // Add skill 1
      const sql2 = `INSERT OR REPLACE INTO abilities (hero_id, ability_type, name, description) VALUES (${hero.id}, 'Skill1', '${hero.name} Skill 1', 'Sample first skill for ${hero.name}');`
      
      // Add skill 2  
      const sql3 = `INSERT OR REPLACE INTO abilities (hero_id, ability_type, name, description) VALUES (${hero.id}, 'Skill2', '${hero.name} Skill 2', 'Sample second skill for ${hero.name}');`
      
      // Add ultimate
      const sql4 = `INSERT OR REPLACE INTO abilities (hero_id, ability_type, name, description) VALUES (${hero.id}, 'Ultimate', '${hero.name} Ultimate', 'Sample ultimate ability for ${hero.name}');`
      
      try {
        execSync(`npx wrangler d1 execute mlbb-tools-db --command "${sql1}"`, { stdio: 'pipe' })
        execSync(`npx wrangler d1 execute mlbb-tools-db --command "${sql2}"`, { stdio: 'pipe' })
        execSync(`npx wrangler d1 execute mlbb-tools-db --command "${sql3}"`, { stdio: 'pipe' })
        execSync(`npx wrangler d1 execute mlbb-tools-db --command "${sql4}"`, { stdio: 'pipe' })
        
        console.log(`   ✅ Added 4 abilities for ${hero.name}`)
      } catch (error) {
        console.log(`   ❌ Failed to add abilities for ${hero.name}`)
      }
    }
    
    // Verify the upload
    console.log('\n🔍 Verifying upload...')
    const result = execSync('npx wrangler d1 execute mlbb-tools-db --command "SELECT COUNT(*) as count FROM abilities;"', {
      encoding: 'utf-8'
    })
    
    console.log('Result:', result)
    
    // Also check specific abilities
    const abilitiesResult = execSync('npx wrangler d1 execute mlbb-tools-db --command "SELECT hero_id, ability_type, name FROM abilities LIMIT 10;"', {
      encoding: 'utf-8'
    })
    
    console.log('Sample abilities:', abilitiesResult)
    
  } catch (error) {
    console.error('❌ Upload failed:', error)
  }
}

uploadSampleAbilities()

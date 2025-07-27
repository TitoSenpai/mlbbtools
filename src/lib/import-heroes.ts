// Bulk Hero Import Script for MLBB Tools
// Imports all heroes from heroes-data.ts into D1 database

import { allMLBBHeroes, heroStats } from '../data/heroes-data'

interface ImportResponse {
  success: boolean
  imported: number
  skipped: number
  errors: string[]
}

export async function importAllHeroes(): Promise<ImportResponse> {
  const response: ImportResponse = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: []
  }

  console.log(`🎮 Starting import of ${allMLBBHeroes.length} MLBB heroes...`)
  console.log(`📊 Hero distribution:`, heroStats.byRole)

  try {
    // First, get existing heroes to avoid duplicates
    const existingResponse = await fetch('/api/mlbb?action=get-heroes')
    const existingData = await existingResponse.json() as { success: boolean; data: { name: string }[] }
    
    const existingHeroNames = existingData.success 
      ? existingData.data.map((hero: { name: string }) => hero.name.toLowerCase())
      : []

    console.log(`📝 Found ${existingHeroNames.length} existing heroes`)

    // Import heroes in batches to avoid overwhelming the API
    const batchSize = 5
    for (let i = 0; i < allMLBBHeroes.length; i += batchSize) {
      const batch = allMLBBHeroes.slice(i, i + batchSize)
      
      console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allMLBBHeroes.length/batchSize)}`)
      
      for (const heroData of batch) {
        // Skip if hero already exists
        if (existingHeroNames.includes(heroData.name.toLowerCase())) {
          console.log(`⏭️  Skipping ${heroData.name} (already exists)`)
          response.skipped++
          continue
        }

        try {
          const createResponse = await fetch('/api/mlbb', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'create-hero',
              heroData: {
                name: heroData.name,
                role: heroData.role,
                difficulty: heroData.difficulty,
                win_rate: heroData.win_rate,
                pick_rate: heroData.pick_rate,
                ban_rate: heroData.ban_rate,
                is_active: heroData.is_active,
                release_year: heroData.release_year
              }
            })
          })

          const result = await createResponse.json() as { success: boolean; error?: string }
          
          if (result.success) {
            console.log(`✅ Imported ${heroData.name} (${heroData.role})`)
            response.imported++
          } else {
            console.error(`❌ Failed to import ${heroData.name}:`, result.error)
            response.errors.push(`${heroData.name}: ${result.error || 'Unknown error'}`)
          }

          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100))

        } catch (error) {
          console.error(`💥 Error importing ${heroData.name}:`, error)
          response.errors.push(`${heroData.name}: ${error}`)
        }
      }

      // Longer delay between batches
      if (i + batchSize < allMLBBHeroes.length) {
        console.log('⏱️  Waiting between batches...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    response.success = response.errors.length === 0
    
    console.log(`🎉 Import complete!`)
    console.log(`✅ Imported: ${response.imported} heroes`)
    console.log(`⏭️  Skipped: ${response.skipped} heroes`)
    console.log(`❌ Errors: ${response.errors.length}`)
    
    if (response.errors.length > 0) {
      console.log('🚨 Errors encountered:')
      response.errors.forEach(error => console.log(`  - ${error}`))
    }

  } catch (error) {
    console.error('💥 Import failed:', error)
    response.errors.push(`Global error: ${error}`)
  }

  return response
}

// Utility function to run import from browser console
export function runHeroImport() {
  importAllHeroes().then(result => {
    console.log('Import Result:', result)
  })
}

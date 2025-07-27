// Enhanced Hero Import Script for MLBB Tools
// Imports all heroes from heroes-data.ts with detailed information into D1 database

import { allMLBBHeroes, heroStats } from '../data/heroes-data'
import { getDetailedHeroData, hasDetailedData } from '../data/detailed-heroes'

interface ImportResponse {
  success: boolean
  imported: number
  updated: number
  skipped: number
  errors: string[]
}

export async function importAllHeroesEnhanced(): Promise<ImportResponse> {
  const response: ImportResponse = {
    success: false,
    imported: 0,
    updated: 0,
    skipped: 0,
    errors: []
  }

  console.log(`🎮 Starting enhanced import of ${allMLBBHeroes.length} MLBB heroes...`)
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
    const batchSize = 3 // Smaller batches for detailed data
    for (let i = 0; i < allMLBBHeroes.length; i += batchSize) {
      const batch = allMLBBHeroes.slice(i, i + batchSize)
      
      console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allMLBBHeroes.length/batchSize)}`)
      
      for (const heroData of batch) {
        // Check if hero already exists
        const alreadyExists = existingHeroNames.includes(heroData.name.toLowerCase())
        
        try {
          // Get detailed data if available
          const detailedData = hasDetailedData(heroData.name) 
            ? getDetailedHeroData(heroData.name) 
            : null

          // Prepare enhanced hero data
          const enhancedHeroData = {
            name: heroData.name,
            role: heroData.role,
            difficulty: heroData.difficulty,
            win_rate: heroData.win_rate,
            pick_rate: heroData.pick_rate,
            ban_rate: heroData.ban_rate,
            is_active: heroData.is_active,
            release_year: heroData.release_year,
            // Add detailed data if available
            ...(detailedData && {
              title: detailedData.title,
              specialty: detailedData.specialty,
              lane: detailedData.lane,
              price_bp: detailedData.price?.battlePoints,
              price_diamonds: detailedData.price?.diamonds,
              skill_resource: detailedData.skillResource,
              damage_type: detailedData.damageType,
              attack_type: detailedData.basicAttackType,
              detailed_stats: detailedData.stats,
              abilities: detailedData.abilities,
              ratings: detailedData.ratings,
              lore: detailedData.lore?.background + (detailedData.lore?.story ? '\n\n' + detailedData.lore.story : ''),
              relationships: detailedData.relationships,
              voice_actors: detailedData.voiceActors,
              trivia: detailedData.trivia,
              portrait_url: detailedData.portrait,
              splash_art_url: detailedData.splashArt
            })
          }

          const createResponse = await fetch('/api/mlbb', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'create-hero',
              heroData: enhancedHeroData
            })
          })

          const result = await createResponse.json() as { success: boolean; error?: string }
          
          if (result.success) {
            if (alreadyExists) {
              console.log(`🔄 Updated ${heroData.name} (${heroData.role})${detailedData ? ' with detailed data' : ''}`)
              response.updated++
            } else {
              console.log(`✅ Imported ${heroData.name} (${heroData.role})${detailedData ? ' with detailed data' : ''}`)
              response.imported++
            }
          } else {
            console.error(`❌ Failed to import ${heroData.name}:`, result.error)
            response.errors.push(`${heroData.name}: ${result.error || 'Unknown error'}`)
          }

          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 200))

        } catch (error) {
          console.error(`💥 Error importing ${heroData.name}:`, error)
          response.errors.push(`${heroData.name}: ${error}`)
        }
      }

      // Longer delay between batches
      if (i + batchSize < allMLBBHeroes.length) {
        console.log('⏱️  Waiting between batches...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    response.success = response.errors.length === 0
    
    console.log(`🎉 Enhanced import complete!`)
    console.log(`✅ Imported: ${response.imported} heroes`)
    console.log(`🔄 Updated: ${response.updated} heroes`)
    console.log(`⏭️  Skipped: ${response.skipped} heroes`)
    console.log(`❌ Errors: ${response.errors.length}`)
    
    if (response.errors.length > 0) {
      console.log('🚨 Errors encountered:')
      response.errors.forEach(error => console.log(`  - ${error}`))
    }

  } catch (error) {
    console.error('💥 Enhanced import failed:', error)
    response.errors.push(`Global error: ${error}`)
  }

  return response
}

// Utility function to run enhanced import from browser console
export function runEnhancedHeroImport() {
  importAllHeroesEnhanced().then(result => {
    console.log('Enhanced Import Result:', result)
  })
}

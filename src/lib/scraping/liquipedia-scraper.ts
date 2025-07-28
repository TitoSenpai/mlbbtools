// Liquipedia-specific scraper for MLBB hero data
// Extracts comprehensive hero information from Liquipedia pages

import { BaseScraper, ScrapingResult, MLBB_SCRAPING_CONFIG, parseStatValue } from './base-scraper'
import type { CheerioAPI } from 'cheerio'

export interface HeroBasicInfo {
  name: string
  role: string
  lane?: string
  region?: string
  release_date?: string
  slug: string
  image_url?: string
  thumbnail_url?: string
}

export interface HeroStats {
  level: number
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

export interface HeroAbility {
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
}

export interface HeroLore {
  background?: string
  detailed_story?: string
  relationships?: string[]
  quotes?: string[]
  trivia?: string[]
}

export interface HeroPatch {
  patch_version: string
  change_type: 'buff' | 'nerf' | 'rework' | 'new' | 'other'
  change_summary: string
  detailed_changes?: Record<string, unknown>
  change_date?: string
  source_url?: string
}

export interface HeroEsportsStats {
  tournament_name?: string
  tournament_tier?: string
  season?: string
  win_rate?: number
  pick_rate?: number
  ban_rate?: number
  total_games?: number
  wins?: number
  losses?: number
  priority_score?: number
}

export interface ComprehensiveHeroData {
  basic_info: HeroBasicInfo
  stats: HeroStats
  abilities: HeroAbility[]
  lore: HeroLore
  patches: HeroPatch[]
  esports_stats: HeroEsportsStats[]
}

export class LiquipediaScraper extends BaseScraper {
  constructor() {
    super(MLBB_SCRAPING_CONFIG)
  }

  async scrapeHeroList(): Promise<ScrapingResult<string[]>> {
    try {
      // Use the main heroes category page instead
      const url = `${this.config.baseUrl}/Category:Heroes`
      const $ = await this.scrapeHtml(url)
      
      const heroLinks: string[] = []
      
      // Look for links in the category page that point to hero pages
      $('#mw-pages a[href^="/mobilelegends/"]').each((_, element) => {
        const href = $(element).attr('href')
        const text = $(element).text().trim()
        
        if (href && text) {
          // Extract hero name from URL (after /mobilelegends/)
          const match = href.match(/\/mobilelegends\/(.+)$/)
          if (match && match[1]) {
            const heroName = decodeURIComponent(match[1])
            // Filter out non-hero pages
            if (!heroName.includes(':') && 
                !heroName.includes('Category') && 
                !heroName.includes('Template') &&
                !heroName.includes('File') &&
                text.length > 2 && text.length < 30) {
              heroLinks.push(heroName)
            }
          }
        }
      })
      
      // If that doesn't work, try a few known heroes to test
      if (heroLinks.length === 0) {
        console.log('📋 No heroes found from category page, using known heroes...')
        heroLinks.push(
          'Alucard',
          'Miya',
          'Eudora',
          'Tigreal',
          'Saber',
          'Alice',
          'Nana',
          'Fanny',
          'Layla',
          'Rafaela',
          'Balmond',
          'Franco',
          'Bane',
          'Bruno',
          'Clint',
          'Kagura',
          'Chou',
          'Sun',
          'Alpha',
          'Ruby',
          'Yi_Sun-shin',
          'Moskov',
          'Johnson',
          'Cyclops',
          'Estes',
          'Hilda',
          'Aurora',
          'Lapu-Lapu',
          'Vexana',
          'Roger',
          'Karrie',
          'Harley',
          'Irithel',
          'Grock',
          'Argus',
          'Odette',
          'Lancelot',
          'Diggie',
          'Hylos',
          'Zhask',
          'Helcurt',
          'Pharsa',
          'Lesley',
          'Angela',
          'Gusion',
          'Valir',
          'Martis',
          'Uranus',
          'Hanabi',
          'Chang\'e',
          'Kaja',
          'Selena',
          'Aldous',
          'Claude',
          'Vale',
          'Leomord',
          'Lunox',
          'Hanzo',
          'Belerick',
          'Kimmy',
          'Thamuz',
          'Harith',
          'Minsitthar',
          'Kadita',
          'Faramis',
          'Badang',
          'Khufra',
          'Granger',
          'Guinevere',
          'Esmeralda',
          'Terizla',
          'X.Borg',
          'Ling',
          'Wan_Wan',
          'Silvanna',
          'Cecilion',
          'Carmilla',
          'Atlas',
          'Popol_and_Kupa',
          'Yu_Zhong',
          'Luo_Yi',
          'Benedetta',
          'Yve',
          'Mathilda',
          'Paquito',
          'Gloo',
          'Phoveus',
          'Natan',
          'Aulus',
          'Aamon',
          'Floryn',
          'Valentina',
          'Edith',
          'Yin',
          'Melissa',
          'Xavier',
          'Julian',
          'Joy',
          'Fredrinn',
          'Novaria',
          'Ixia',
          'Nolan',
          'Arlott',
          'Zhuxin',
          'Chip',
          'Cici'
        )
      }
      
      console.log(`✅ Found ${heroLinks.length} potential heroes`)
      
      return {
        success: true,
        data: heroLinks.filter(link => link.length > 0),
        timestamp: new Date().toISOString()
      }
      
    } catch (error) {
      console.error('❌ Failed to scrape hero list:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  async scrapeHeroData(heroName: string): Promise<ScrapingResult<ComprehensiveHeroData>> {
    try {
      const url = `${this.config.baseUrl}/${encodeURIComponent(heroName)}`
      console.log(`🔍 Scraping hero data for: ${heroName}`)
      
      const $ = await this.scrapeHtml(url)
      
      const heroData: ComprehensiveHeroData = {
        basic_info: await this.extractBasicInfo($, heroName),
        stats: await this.extractStats($),
        abilities: await this.extractAbilities($),
        lore: await this.extractLore($),
        patches: await this.extractPatches($),
        esports_stats: await this.extractEsportsStats($)
      }
      
      console.log(`✅ Successfully scraped data for ${heroName}`)
      
      return {
        success: true,
        data: heroData,
        url,
        timestamp: new Date().toISOString()
      }
      
    } catch (error) {
      console.error(`❌ Failed to scrape ${heroName}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: `${this.config.baseUrl}/${heroName}`,
        timestamp: new Date().toISOString()
      }
    }
  }

  private async extractBasicInfo($: CheerioAPI, heroName: string): Promise<HeroBasicInfo> {
    const name = this.normalizeText($('h1, .page-title, .hero-name').first().text()) || heroName
    
    // Extract role from infobox or content
    const role = this.normalizeText($('.infobox .role, .hero-role, [data-role]').first().text()) ||
                 this.extractFromInfobox($, 'Role') ||
                 this.extractFromInfobox($, 'Class') ||
                 'Unknown'
    
    // Extract lane information
    const lane = this.extractFromInfobox($, 'Lane') ||
                 this.extractFromInfobox($, 'Position') ||
                 undefined
    
    // Extract region
    const region = this.extractFromInfobox($, 'Region') ||
                   this.extractFromInfobox($, 'Origin') ||
                   undefined
    
    // Extract release date
    const release_date = this.extractFromInfobox($, 'Release Date') ||
                        this.extractFromInfobox($, 'Released') ||
                        undefined
    
    // Extract images
    const image_url = $('.infobox img, .hero-image img').first().attr('src') ||
                     $('img[alt*="' + name + '"]').first().attr('src') ||
                     undefined
    
    return {
      name,
      role,
      lane,
      region,
      release_date,
      slug: this.createSlug(name),
      image_url: image_url ? this.resolveUrl(image_url) : undefined,
      thumbnail_url: image_url ? this.resolveUrl(image_url) : undefined
    }
  }

  private extractFromInfobox($: CheerioAPI, label: string): string | undefined {
    // Try different infobox formats
    const selectors = [
      `.infobox tr td:contains("${label}") + td`,
      `.infobox tr th:contains("${label}") + td`,
      `.infobox-label:contains("${label}") + .infobox-data`,
      `[data-label="${label}"]`,
      `.${label.toLowerCase().replace(' ', '-')}`
    ]
    
    for (const selector of selectors) {
      const element = $(selector).first()
      if (element.length > 0) {
        return this.normalizeText(element.text())
      }
    }
    
    return undefined
  }

  private async extractStats($: CheerioAPI): Promise<HeroStats> {
    const stats: HeroStats = { level: 1 }
    
    // Try to find stats table or section
    const statsSection = $('.stats-table, .hero-stats, .statistics').first()
    
    if (statsSection.length > 0) {
      // Extract individual stats
      const statMappings = {
        'HP': 'hp',
        'Health': 'hp',
        'Mana': 'mana',
        'MP': 'mana',
        'Attack': 'attack',
        'ATK': 'attack',
        'Physical Attack': 'attack',
        'Defense': 'defense',
        'DEF': 'defense',
        'Physical Defense': 'defense',
        'Magic Defense': 'magic_defense',
        'Magic Resist': 'magic_defense',
        'Movement Speed': 'move_speed',
        'Move Speed': 'move_speed',
        'Speed': 'move_speed',
        'Attack Speed': 'attack_speed',
        'AS': 'attack_speed',
        'Critical Rate': 'crit_rate',
        'Crit Rate': 'crit_rate'
      }
      
      for (const [label, field] of Object.entries(statMappings)) {
        const value = this.extractStatFromSection(statsSection, label)
        if (value !== undefined) {
          ;(stats as unknown as Record<string, unknown>)[field] = value
        }
      }
    }
    
    return stats
  }

  private extractStatFromSection(section: ReturnType<CheerioAPI>, label: string): number | undefined {
    const text = section.find(`td:contains("${label}"), th:contains("${label}")`).next().text()
    if (text) {
      const parsed = parseStatValue(text)
      return parsed?.base
    }
    return undefined
  }

  private async extractAbilities($: CheerioAPI): Promise<HeroAbility[]> {
    const abilities: HeroAbility[] = []
    
    // Try different ability section selectors
    const abilitySelectors = [
      '.abilities',
      '.skills',
      '.hero-abilities',
      '.skill-section',
      '#Abilities',
      '#Skills'
    ]
    
    for (const selector of abilitySelectors) {
      const section = $(selector)
      if (section.length > 0) {
        // Extract abilities from this section
        section.find('.ability, .skill').each((index, element) => {
          const ability = this.parseAbility($(element), index)
          if (ability) {
            abilities.push(ability)
          }
        })
        break
      }
    }
    
    // Fallback: look for ability headers
    if (abilities.length === 0) {
      const abilityTypes = ['Passive', 'Skill 1', 'Skill 2', 'Ultimate']
      abilityTypes.forEach((type) => {
        const header = $(`h3:contains("${type}"), h4:contains("${type}"), .ability-header:contains("${type}")`)
        if (header.length > 0) {
          const content = header.next()
          const ability = this.parseAbilityFromContent(content, type)
          if (ability) {
            abilities.push(ability)
          }
        }
      })
    }
    
    return abilities
  }

  private parseAbility(element: ReturnType<CheerioAPI>, index: number): HeroAbility | null {
    const types: HeroAbility['ability_type'][] = ['Passive', 'Skill1', 'Skill2', 'Ultimate']
    
    const name = this.normalizeText(element.find('.ability-name, .skill-name, h3, h4').first().text())
    const description = this.normalizeText(element.find('.ability-description, .skill-description, p').first().text())
    
    if (!name || !description) return null
    
    return {
      ability_type: types[index] || 'Skill1',
      name,
      description,
      cooldown: this.extractAbilityProperty(element, 'Cooldown'),
      mana_cost: this.extractAbilityProperty(element, 'Mana Cost'),
      damage_scaling: this.extractAbilityProperty(element, 'Damage'),
      range_value: this.extractAbilityProperty(element, 'Range')
    }
  }

  private parseAbilityFromContent(content: ReturnType<CheerioAPI>, type: string): HeroAbility | null {
    const name = this.normalizeText(content.find('strong, b').first().text()) || `${type} Ability`
    const description = this.normalizeText(content.text())
    
    if (!description) return null
    
    const abilityTypes: { [key: string]: HeroAbility['ability_type'] } = {
      'Passive': 'Passive',
      'Skill 1': 'Skill1',
      'Skill 2': 'Skill2',
      'Ultimate': 'Ultimate'
    }
    
    return {
      ability_type: abilityTypes[type] || 'Skill1',
      name,
      description
    }
  }

  private extractAbilityProperty(element: ReturnType<CheerioAPI>, property: string): string | undefined {
    const text = element.find(`:contains("${property}")`).text()
    const match = text.match(new RegExp(`${property}:?\\s*([^\\n]+)`))
    return match ? this.normalizeText(match[1]) : undefined
  }

  private async extractLore($: CheerioAPI): Promise<HeroLore> {
    const lore: HeroLore = {}
    
    // Look for lore sections
    const loreSelectors = [
      '#Lore',
      '#Background',
      '#Story',
      '.lore',
      '.background',
      '.story'
    ]
    
    for (const selector of loreSelectors) {
      const section = $(selector)
      if (section.length > 0) {
        lore.background = this.normalizeText(section.text())
        break
      }
    }
    
    // Extract relationships
    const relationshipSection = $('#Relationships, .relationships')
    if (relationshipSection.length > 0) {
      const relationships: string[] = []
      relationshipSection.find('a, .hero-link').each((_, el) => {
        const name = $(el).text().trim()
        if (name && !relationships.includes(name)) {
          relationships.push(name)
        }
      })
      lore.relationships = relationships
    }
    
    return lore
  }

  private async extractPatches($: CheerioAPI): Promise<HeroPatch[]> {
    const patches: HeroPatch[] = []
    
    // Look for patch history sections
    const patchSelectors = [
      '#Patch_History',
      '#Version_History',
      '#Updates',
      '.patch-history',
      '.version-history'
    ]
    
    for (const selector of patchSelectors) {
      const section = $(selector)
      if (section.length > 0) {
        section.find('li, .patch-entry').each((_, element) => {
          const patch = this.parsePatchEntry($(element))
          if (patch) {
            patches.push(patch)
          }
        })
        break
      }
    }
    
    return patches
  }

  private parsePatchEntry(element: ReturnType<CheerioAPI>): HeroPatch | null {
    const text = this.normalizeText(element.text())
    if (!text) return null
    
    // Try to extract version number
    const versionMatch = text.match(/(\d+\.\d+(?:\.\d+)?)/);
    const version = versionMatch ? versionMatch[1] : 'Unknown'
    
    // Determine change type
    let changeType: HeroPatch['change_type'] = 'other'
    if (text.toLowerCase().includes('buff') || text.toLowerCase().includes('increase')) {
      changeType = 'buff'
    } else if (text.toLowerCase().includes('nerf') || text.toLowerCase().includes('decrease')) {
      changeType = 'nerf'
    } else if (text.toLowerCase().includes('rework') || text.toLowerCase().includes('redesign')) {
      changeType = 'rework'
    }
    
    return {
      patch_version: version,
      change_type: changeType,
      change_summary: text
    }
  }

  private async extractEsportsStats($: CheerioAPI): Promise<HeroEsportsStats[]> {
    const stats: HeroEsportsStats[] = []
    
    // Look for esports/competitive sections
    const esportsSelectors = [
      '#Competitive',
      '#Esports',
      '#Tournament',
      '.competitive',
      '.esports',
      '.tournament-stats'
    ]
    
    for (const selector of esportsSelectors) {
      const section = $(selector)
      if (section.length > 0) {
        // Try to extract tournament data
        section.find('table tr').each((_, row) => {
          const stat = this.parseEsportsStat($(row))
          if (stat) {
            stats.push(stat)
          }
        })
        break
      }
    }
    
    return stats
  }

  private parseEsportsStat(row: ReturnType<CheerioAPI>): HeroEsportsStats | null {
    const cells = row.find('td')
    if (cells.length < 2) return null
    
    const tournament = this.normalizeText(cells.eq(0).text())
    const winRateText = cells.eq(1).text()
    const winRate = this.extractNumber(winRateText)
    
    if (!tournament) return null
    
    return {
      tournament_name: tournament,
      win_rate: winRate || undefined
    }
  }

  private resolveUrl(url: string): string {
    if (url.startsWith('http')) return url
    if (url.startsWith('//')) return 'https:' + url
    if (url.startsWith('/')) return 'https://liquipedia.net' + url
    return 'https://liquipedia.net/mobilelegends/' + url
  }
}

// Enhanced hero data with detailed stats and abilities

export interface HeroStats {
  hp: { base: number; max: number; growth: number }
  hpRegen: { base: number; max: number; growth: number }
  mana: { base: number; max: number; growth: number }
  manaRegen: { base: number; max: number; growth: number }
  physicalAttack: { base: number; max: number; growth: number }
  magicPower: { base: number; max: number; growth: number }
  physicalDefense: { base: number; max: number; growth: number }
  magicDefense: { base: number; max: number; growth: number }
  attackSpeed: { base: number; max: number; growth: number }
  criticalDamage: number
  movementSpeed: number
  basicAttackRange: number
}

export interface HeroAbility {
  name: string
  type: 'Passive' | 'Skill 1' | 'Skill 2' | 'Ultimate'
  description: string
  damage?: string
  cooldown?: string
  manaCost?: string
  effects?: string[]
}

export interface HeroRatings {
  durability: number
  offense: number
  controlEffects: number
  difficulty: number
}

export interface DetailedHero {
  id: string
  name: string
  title: string
  role: string
  specialty: string[]
  lane: string
  price: {
    battlePoints: number
    diamonds: number
    tickets?: number
  }
  releaseDate: string
  skillResource: string
  damageType: string
  basicAttackType: string
  stats: HeroStats
  abilities: HeroAbility[]
  ratings: HeroRatings
  lore: {
    background: string
    story: string
  }
  relationships: string[]
  voiceActors: {
    english?: string
    japanese?: string
    chinese?: string
  }
  trivia: string[]
  portrait: string
  splashArt: string
}

// Sample detailed hero data - we'll expand this for all heroes
export const detailedHeroData: Record<string, DetailedHero> = {
  miya: {
    id: 'miya',
    name: 'Miya',
    title: 'Moonlight Archer',
    role: 'Marksman',
    specialty: ['Finisher', 'Damage'],
    lane: 'Gold Lane',
    price: {
      battlePoints: 10800,
      diamonds: 399,
      tickets: 399
    },
    releaseDate: '2016',
    skillResource: 'Mana',
    damageType: 'Physical',
    basicAttackType: 'Ranged',
    stats: {
      hp: { base: 2225, max: 4367, growth: 153 },
      hpRegen: { base: 6.0, max: 9.0, growth: 0.2143 },
      mana: { base: 500, max: 1900, growth: 100 },
      manaRegen: { base: 4, max: 6.8, growth: 0.2 },
      physicalAttack: { base: 115, max: 255, growth: 10 },
      magicPower: { base: 0, max: 0, growth: 0 },
      physicalDefense: { base: 17, max: 74, growth: 4.0714 },
      magicDefense: { base: 15, max: 50, growth: 2.5 },
      attackSpeed: { base: 1.06, max: 1.41, growth: 0.025 },
      criticalDamage: 200,
      movementSpeed: 240,
      basicAttackRange: 4.8
    },
    abilities: [
      {
        name: 'Moon Blessing',
        type: 'Passive',
        description: 'Each time Miya hits a target with her Basic Attack, she gains 5% Attack Speed for 4 seconds. Stacks up to 5 times. After reaching full stacks, Miya summons a Moonlight Shadow with each Basic Attack that deals 30 (+30% Total Physical Attack) Physical Damage.',
        effects: ['Attack Speed Buff', '20% Attack Effects', '0% Lifesteal Ratio']
      },
      {
        name: 'Moon Arrow',
        type: 'Skill 1',
        description: 'Miya shoots two extra arrows with each Basic Attack, dealing 10–35 (+100% Total Physical Attack) Physical Damage to the target enemy and 30% damage to nearby targets. This effect lasts 4 seconds.',
        damage: '10–35 (+100% Total Physical Attack)',
        cooldown: '12–8 seconds',
        manaCost: '50–70',
        effects: ['20% Attack Effects', '0% Lifesteal Ratio']
      },
      {
        name: 'Arrow of Eclipse',
        type: 'Skill 2',
        description: 'Miya launches an empowered arrow on the target area, dealing 270–420 (+45% Total Physical Attack) Physical Damage to enemies within and immobilizing them for 1.2 seconds. The arrow then splits into 6 scattering minor arrows.',
        damage: '270–420 (+45% Total Physical Attack)',
        cooldown: '12–8 seconds',
        manaCost: '80–120',
        effects: ['Immobilize', 'AOE', 'Slow']
      },
      {
        name: 'Hidden Moonlight',
        type: 'Ultimate',
        description: 'Miya removes all debuffs on her and conceals herself, gaining 35%–65% extra Movement Speed. This state lasts 2 seconds or until she launches an attack. Miya gains full stacks of Moon Blessing upon leaving the state.',
        cooldown: '40–25 seconds',
        manaCost: '100–150',
        effects: ['Conceal', 'Remove CC', 'Movement Speed Buff']
      }
    ],
    ratings: {
      durability: 1,
      offense: 7,
      controlEffects: 4,
      difficulty: 1
    },
    lore: {
      background: 'The Moon Priestess guarding the Azrya Woodlands. Born at the end of the Era of Strife, Miya bore witness to the unspeakable tragedies that befell the elves during the Endless War.',
      story: 'Born at the end of the Era of Strife, Miya bore witness to the unspeakable tragedies that befell the elves during the Endless War. She saw how the Abyss defiled the Shadow Swamp and corrupted many of her people into Dark Elves. It was not until the Moon Goddess created the Lunar Aegis over Azrya that the Moon Elves were able to thrive again under its protection. Miya became the Priestess of the Moon, and for thousands of years she served faithfully in the Lunar Temple, diligently watching over her people.'
    },
    relationships: ['Estes (brother)', 'Alucard (love interest)', 'Alice (enemy)', 'Balmond (enemy)'],
    voiceActors: {
      english: 'Christina Clark',
      japanese: 'Morisaki Miho',
      chinese: 'Youwu Zhang'
    },
    trivia: [
      'She is the first hero in the game according to sale time',
      'Miya is the game\'s official mascot, appearing at the end of every trailer',
      'She appears on the Mobile Legends: Bang Bang icon in Google Play',
      'One of her famous lines: "Where there is life, there is hope"'
    ],
    portrait: '/heroes/portraits/miya.jpg',
    splashArt: '/heroes/splash/miya.jpg'
  },
  
  // We'll add more heroes here - let's add a few more examples
  alucard: {
    id: 'alucard',
    name: 'Alucard',
    title: 'Demon Hunter',
    role: 'Fighter',
    specialty: ['Chase', 'Damage'],
    lane: 'Jungle',
    price: {
      battlePoints: 15000,
      diamonds: 399,
      tickets: 399
    },
    releaseDate: '2016',
    skillResource: 'Mana',
    damageType: 'Physical',
    basicAttackType: 'Melee',
    stats: {
      hp: { base: 2467, max: 4890, growth: 173 },
      hpRegen: { base: 8.2, max: 12.8, growth: 0.3286 },
      mana: { base: 430, max: 1730, growth: 92.857 },
      manaRegen: { base: 3.8, max: 6.2, growth: 0.1714 },
      physicalAttack: { base: 123, max: 287, growth: 11.714 },
      magicPower: { base: 0, max: 0, growth: 0 },
      physicalDefense: { base: 18, max: 83, growth: 4.6429 },
      magicDefense: { base: 15, max: 50, growth: 2.5 },
      attackSpeed: { base: 0.97, max: 1.36, growth: 0.0279 },
      criticalDamage: 200,
      movementSpeed: 260,
      basicAttackRange: 1.8
    },
    abilities: [
      {
        name: 'Pursuit',
        type: 'Passive',
        description: 'When Alucard deals damage to an enemy hero, he gains 10% extra Physical Lifesteal for 5 seconds. This effect can stack up to 5 times.',
        effects: ['Physical Lifesteal', 'Stack Buff']
      },
      {
        name: 'Groundsplitter',
        type: 'Skill 1',
        description: 'Alucard jumps towards the target area and strikes, dealing Physical Damage to enemies in the area. If this skill hits an enemy, the cooldown is reduced by 4 seconds.',
        damage: '270–520 (+130% Total Physical Attack)',
        cooldown: '10–7 seconds',
        manaCost: '70–95',
        effects: ['Charge', 'AOE', 'Cooldown Reduction']
      },
      {
        name: 'Whirling Smash',
        type: 'Skill 2',
        description: 'Alucard strikes all enemies around him twice, with each strike dealing Physical Damage. Enemies hit will be slowed.',
        damage: '200–300 (+80% Total Physical Attack) per strike',
        cooldown: '10–8 seconds',
        manaCost: '60–85',
        effects: ['AOE', 'Slow', 'Two Strikes']
      },
      {
        name: 'Fission Wave',
        type: 'Ultimate',
        description: 'Alucard enhances himself, increasing Physical Attack and Physical Lifesteal. He also gains immunity to slow effects.',
        cooldown: '50–35 seconds',
        manaCost: '120–160',
        effects: ['Physical Attack Buff', 'Physical Lifesteal Buff', 'Slow Immunity']
      }
    ],
    ratings: {
      durability: 6,
      offense: 8,
      controlEffects: 3,
      difficulty: 5
    },
    lore: {
      background: 'A demon hunter from the Moniyan Empire, wielding ancient demon-slaying techniques passed down through generations.',
      story: 'Alucard was born in a noble family in the Moniyan Empire. As a child, he witnessed his village being destroyed by demons, losing his family in the process. This tragedy awakened his determination to become a demon hunter and protect others from suffering the same fate.'
    },
    relationships: ['Miya (love interest)', 'Tigreal (ally)', 'Alice (enemy)'],
    voiceActors: {
      english: 'Unknown',
      chinese: 'Unknown'
    },
    trivia: [
      'His name is "Dracula" spelled backwards',
      'He was one of the original heroes in Mobile Legends',
      'Popular choice for beginners due to his simple mechanics'
    ],
    portrait: '/heroes/portraits/alucard.jpg',
    splashArt: '/heroes/splash/alucard.jpg'
  },

  gusion: {
    id: 'gusion',
    name: 'Gusion',
    title: 'Holy Blade',
    role: 'Assassin',
    specialty: ['Burst', 'Magic Damage'],
    lane: 'Jungle',
    price: {
      battlePoints: 32000,
      diamonds: 599
    },
    releaseDate: '2018',
    skillResource: 'Energy',
    damageType: 'Magic',
    basicAttackType: 'Melee',
    stats: {
      hp: { base: 2318, max: 4135, growth: 129.8 },
      hpRegen: { base: 7.4, max: 11.2, growth: 0.2714 },
      mana: { base: 0, max: 0, growth: 0 }, // Uses Energy instead
      manaRegen: { base: 0, max: 0, growth: 0 },
      physicalAttack: { base: 110, max: 198, growth: 6.2857 },
      magicPower: { base: 0, max: 0, growth: 0 },
      physicalDefense: { base: 16, max: 69, growth: 3.7857 },
      magicDefense: { base: 15, max: 50, growth: 2.5 },
      attackSpeed: { base: 1.04, max: 1.33, growth: 0.0207 },
      criticalDamage: 200,
      movementSpeed: 260,
      basicAttackRange: 2.2
    },
    abilities: [
      {
        name: 'Dagger Specialist',
        type: 'Passive',
        description: 'Every time Gusion hits an enemy with a Shadowblade Slaughter dagger, he will recover 1 Energy. If the dagger hits after bouncing, he recovers 2 Energy instead.',
        effects: ['Energy Recovery', 'Enhanced Recovery on Bounce']
      },
      {
        name: 'Shadowblade Slaughter',
        type: 'Skill 1',
        description: 'Gusion throws out 5 daggers in a fan-shaped area. Each dagger deals Magic Damage to the first enemy hit and bounces to nearby enemies. Daggers will return to Gusion after a short period.',
        damage: '220–370 (+120% Total Magic Power)',
        cooldown: '0 seconds',
        manaCost: '5 Energy per dagger',
        effects: ['Bounce', 'Multiple Daggers', 'Auto Return']
      },
      {
        name: 'Incandescence',
        type: 'Skill 2',
        description: 'Gusion blinks in the target direction and enhances his next Basic Attack to deal extra Magic Damage based on the enemy\'s lost HP.',
        damage: '250–400 (+80% Total Magic Power) + 8% enemy lost HP',
        cooldown: '12–8 seconds',
        manaCost: '3 Energy',
        effects: ['Blink', 'Enhanced Basic Attack', 'Execute Damage']
      },
      {
        name: 'Secretive Raid',
        type: 'Ultimate',
        description: 'Gusion throws daggers around him, then dashes to the target enemy hero, dealing massive Magic Damage. If the target dies within 4 seconds, the cooldown is reset.',
        damage: '500–900 (+200% Total Magic Power)',
        cooldown: '45–25 seconds',
        manaCost: '4 Energy',
        effects: ['Dash', 'Reset on Kill', 'High Damage']
      }
    ],
    ratings: {
      durability: 3,
      offense: 9,
      controlEffects: 2,
      difficulty: 8
    },
    lore: {
      background: 'The youngest heir of the Paxley family, a noble house known for their magical prowess in the Moniyan Empire.',
      story: 'Born into the prestigious Paxley family, Gusion was expected to follow the family tradition of magic and become a powerful mage. However, he rebelled against his family\'s expectations and chose to forge his own path as a magical assassin, combining his family\'s magical heritage with deadly precision and speed.'
    },
    relationships: ['Lesley (love interest)', 'Aamon (cousin)', 'Paxley Family (relatives)'],
    voiceActors: {
      english: 'Unknown',
      chinese: 'Unknown'
    },
    trivia: [
      'Most banned assassin in professional play',
      'Known for his complex combo mechanics',
      'His daggers return to him automatically',
      'Uses Energy instead of Mana as his resource'
    ],
    portrait: '/heroes/portraits/gusion.jpg',
    splashArt: '/heroes/splash/gusion.jpg'
  }
}

// Function to get detailed hero data by name
export function getDetailedHeroData(heroName: string): DetailedHero | null {
  const heroKey = heroName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return detailedHeroData[heroKey] || null
}

// Function to check if detailed data exists for a hero
export function hasDetailedData(heroName: string): boolean {
  const heroKey = heroName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return heroKey in detailedHeroData
}

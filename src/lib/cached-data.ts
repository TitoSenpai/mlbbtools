// Next.js 15 caching improvements demo
// Note: 'use cache' directive requires Next.js canary version

interface GameStats {
  totalPlayers: number
  totalMatches: number
  averageRating: number
  topHeroes: string[]
}

export async function getGameStats(): Promise<GameStats> {
  // 'use cache' - Enable when using Next.js canary
  
  // Simulate API call - in real app, this would fetch from database/API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    totalPlayers: 125000000,
    totalMatches: 2500000000,
    averageRating: 4.7,
    topHeroes: ['Fanny', 'Gusion', 'Lancelot', 'Ling', 'Benedetta']
  }
}

export async function getDashboardMetrics() {
  // 'use cache' - Enable when using Next.js canary
  
  // Simulate expensive dashboard calculation
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    dailyActiveUsers: 45234,
    newRegistrations: 1234,
    totalRevenue: 567890,
    conversionRate: 12.5
  }
}

export async function getBlogPosts() {
  // 'use cache' - Enable when using Next.js canary
  
  // Simulate blog data fetching
  await new Promise(resolve => setTimeout(resolve, 600))
  
  return [
    {
      id: 1,
      title: "Top 10 Heroes for Season 31",
      excerpt: "Discover the most powerful heroes dominating the current meta...",
      author: "MLBB Pro",
      publishedAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Advanced Jungle Strategies",
      excerpt: "Master the jungle with these pro-level techniques...",
      author: "MLBB Expert",
      publishedAt: "2024-01-12"
    }
  ]
}

import { notFound } from 'next/navigation'
import { getDetailedHeroData, hasDetailedData } from '@/data/detailed-heroes'
import { HeroProfile } from '@/components/hero-profile'

interface HeroPageProps {
  params: Promise<{
    name: string
  }>
}

export default async function HeroPage({ params }: HeroPageProps) {
  const { name } = await params
  const heroName = decodeURIComponent(name)
  
  // Check if we have detailed data for this hero
  if (!hasDetailedData(heroName)) {
    notFound()
  }
  
  const heroData = getDetailedHeroData(heroName)
  
  if (!heroData) {
    notFound()
  }
  
  return <HeroProfile hero={heroData} />
}

// Generate static params for known heroes with detailed data
export function generateStaticParams() {
  // For now, we only have detailed data for Miya and Alucard
  return [
    { name: 'miya' },
    { name: 'alucard' }
  ]
}

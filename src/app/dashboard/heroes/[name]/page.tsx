import { notFound } from 'next/navigation'
import { getDetailedHeroData, hasDetailedData } from '@/data/detailed-heroes'
import { HeroProfile } from '@/components/hero-profile'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

interface HeroPageProps {
  params: Promise<{
    name: string
  }>
}

export default async function DashboardHeroPage({ params }: HeroPageProps) {
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
  
  return (
    <DashboardLayout>
      <HeroProfile hero={heroData} />
    </DashboardLayout>
  )
}

// Generate static params for known heroes with detailed data
export function generateStaticParams() {
  // For now, we only have detailed data for these heroes
  return [
    { name: 'miya' },
    { name: 'alucard' },
    { name: 'gusion' }
  ]
}

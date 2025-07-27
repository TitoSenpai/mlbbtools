import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function HeroNotFound() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Hero Profile Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This hero doesn&apos;t have a detailed profile yet.
        </p>
        <Link 
          href="/dashboard/heroes" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Back to Heroes
        </Link>
      </div>
    </DashboardLayout>
  )
}

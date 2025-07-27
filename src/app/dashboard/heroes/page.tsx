import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { HeroesManagement } from "@/components/dashboard/heroes-management"

export default function HeroesPage() {
  return (
    <DashboardLayout breadcrumbs={[{ title: "Heroes" }]}>
      <HeroesManagement />
    </DashboardLayout>
  )
}

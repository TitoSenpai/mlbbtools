import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BlogManagement } from "@/components/blog/blog-management"

export default function BlogDashboardPage() {
  const breadcrumbs = [
    { title: "Blog", href: "/dashboard/blog" }
  ]

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <BlogManagement />
    </DashboardLayout>
  )
}

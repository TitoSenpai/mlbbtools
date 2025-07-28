import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  ArrowRight,
  Gamepad2,
  Shield,
  Sword,
  Target
} from "lucide-react"
import { EnhancedStatsSection } from "@/components/enhanced-stats"

// Enable Partial Prerendering for this page (requires Next.js canary)
// export const experimental_ppr = true

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">MLBB Tools</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Blog
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Dashboard
              </Link>
              <Button asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Production Ready Platform
            </Badge>
          </div>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MLBB Tools Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Your comprehensive Mobile Legends: Bang Bang platform featuring a powerful dashboard for content management 
            and a dynamic blog for sharing strategies, guides, and updates with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                Access Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">
                <FileText className="mr-2 h-5 w-5" />
                Read Blog
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Comprehensive dashboard with analytics, user management, and content control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Real-time analytics and metrics</li>
                <li>• User and content management</li>
                <li>• Performance monitoring</li>
                <li>• Customizable reports</li>
              </ul>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/dashboard">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Blog Platform</CardTitle>
              <CardDescription>
                Dynamic blog system for sharing MLBB guides, strategies, and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Create and manage blog posts</li>
                <li>• Category and tag organization</li>
                <li>• Comment system</li>
                <li>• SEO optimization</li>
              </ul>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/blog">
                  Visit Blog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Advanced user authentication and role-based access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Role-based permissions</li>
                <li>• User activity tracking</li>
                <li>• Profile management</li>
                <li>• Security features</li>
              </ul>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/dashboard/users">
                  Manage Users
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* MLBB Features */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-16 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Mobile Legends Features</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Specialized tools and content for the MLBB community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Sword className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Hero Guides</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive guides for all heroes including builds, combos, and strategies
              </p>
            </div>
            <div className="text-center">
              <Target className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Meta Analysis</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Stay updated with the current meta and tier lists for competitive play
              </p>
            </div>
            <div className="text-center">
              <Settings className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Build Calculator</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Optimize your item builds with our advanced calculation tools
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section - Showcasing Next.js 15 PPR & Caching */}
        <div className="mb-16">
          <EnhancedStatsSection />
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of MLBB players using our platform to improve their gameplay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard" className="flex items-center">
                Launch Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/blog" className="flex items-center">
                Explore Content
                <FileText className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Gamepad2 className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">MLBB Tools</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              © 2025 MLBB Tools. Built for the Mobile Legends community.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

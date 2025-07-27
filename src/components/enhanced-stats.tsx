import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getGameStats, getDashboardMetrics } from "@/lib/cached-data"
import { Users, GamepadIcon, Star, TrendingUp } from "lucide-react"

// Cached component for game statistics
async function GameStatsDisplay() {
  const stats = await getGameStats()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPlayers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+5.2% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
          <GamepadIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMatches.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating}</div>
          <p className="text-xs text-muted-foreground">Excellent user feedback</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Heroes</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">{stats.topHeroes.slice(0, 2).join(", ")}</div>
          <p className="text-xs text-muted-foreground">Most picked this season</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Cached component for dashboard metrics
async function DashboardMetricsDisplay() {
  const metrics = await getDashboardMetrics()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.dailyActiveUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+8.3% from yesterday</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.newRegistrations.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+15% from yesterday</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+22% from last week</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
          <p className="text-xs text-muted-foreground">+2.1% from last week</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Loading fallbacks for PPR
function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Main component that combines static and dynamic content with PPR
export function EnhancedStatsSection() {
  return (
    <div className="space-y-6">
      {/* Static header - will be prerendered */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Platform Statistics</h2>
        <p className="text-muted-foreground">Real-time insights from our MLBB community</p>
      </div>
      
      {/* Dynamic content with Suspense boundaries for PPR */}
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <GameStatsDisplay />
      </Suspense>
      
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <DashboardMetricsDisplay />
      </Suspense>
      
      {/* Static footer - will be prerendered */}
      <div className="text-center mt-8 p-4 border-t">
        <p className="text-sm text-muted-foreground">
          Data updated every 15 minutes • Last update: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

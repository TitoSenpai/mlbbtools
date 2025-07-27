"use client"

import { 
  Activity,
  ArrowUpRight,
  Users,
  Eye,
  MessageCircle,
  Calendar
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<{ className?: string }>
}

function MetricCard({ title, value, change, trend, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
            {change}
          </span>{" "}
          from last month
        </p>
      </CardContent>
    </Card>
  )
}

const recentActivity = [
  {
    id: 1,
    type: "blog_post",
    title: "New blog post published: 'Meta Heroes in Season 30'",
    time: "2 minutes ago",
    user: "John Doe",
    avatar: "/avatars/01.png",
  },
  {
    id: 2,
    type: "user_registration",
    title: "5 new users registered",
    time: "15 minutes ago",
    user: "System",
    avatar: "/avatars/system.png",
  },
  {
    id: 3,
    type: "comment",
    title: "New comment on 'Best Build for Alucard'",
    time: "1 hour ago",
    user: "Jane Smith",
    avatar: "/avatars/02.png",
  },
  {
    id: 4,
    type: "analytics",
    title: "Weekly analytics report generated",
    time: "2 hours ago",
    user: "System",
    avatar: "/avatars/system.png",
  },
]

const topPosts = [
  {
    id: 1,
    title: "Complete Guide to Meta Heroes in Season 30",
    views: 12540,
    comments: 89,
    status: "published",
    publishedAt: "2025-01-20",
  },
  {
    id: 2,
    title: "Best Build Combinations for Assassins",
    views: 8932,
    comments: 67,
    status: "published",
    publishedAt: "2025-01-18",
  },
  {
    id: 3,
    title: "Mastering the Art of Jungling",
    views: 7234,
    comments: 45,
    status: "published",
    publishedAt: "2025-01-15",
  },
  {
    id: 4,
    title: "Tank Heroes: When and How to Pick",
    views: 6123,
    comments: 34,
    status: "draft",
    publishedAt: null,
  },
  {
    id: 5,
    title: "Understanding Map Control and Objectives",
    views: 5876,
    comments: 28,
    status: "published",
    publishedAt: "2025-01-12",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your MLBB Tools platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value="12,543"
          change="+15.2%"
          trend="up"
          icon={Users}
        />
        <MetricCard
          title="Blog Views"
          value="89,342"
          change="+28.1%"
          trend="up"
          icon={Eye}
        />
        <MetricCard
          title="Active Posts"
          value="127"
          change="+3.4%"
          trend="up"
          icon={Activity}
        />
        <MetricCard
          title="Comments"
          value="2,847"
          change="+12.7%"
          trend="up"
          icon={MessageCircle}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and activities on your platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback>
                    {activity.user.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time} • by {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Analytics Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Page views and user engagement over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Page Views</span>
                  <span className="font-medium">89,342</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Unique Visitors</span>
                  <span className="font-medium">45,231</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Bounce Rate</span>
                  <span className="font-medium">32.4%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Session Duration</span>
                  <span className="font-medium">4m 32s</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>
            Your most popular blog posts and their performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                      {post.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      {post.comments}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={post.status === "published" ? "default" : "secondary"}
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

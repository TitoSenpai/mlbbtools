"use client"

import * as React from "react"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Tag,
  MessageCircle
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  status: "published" | "draft" | "scheduled"
  author: {
    name: string
    avatar: string
  }
  publishedAt: string | null
  views: number
  comments: number
  categories: string[]
  tags: string[]
  featuredImage?: string
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Complete Guide to Meta Heroes in Season 30",
    slug: "meta-heroes-season-30-guide",
    excerpt: "Discover the most powerful heroes dominating the current meta and learn how to master them effectively.",
    status: "published",
    author: {
      name: "John Doe",
      avatar: "/avatars/01.png"
    },
    publishedAt: "2025-01-20T10:00:00Z",
    views: 12540,
    comments: 89,
    categories: ["Guides", "Meta"],
    tags: ["heroes", "meta", "season30", "guide"]
  },
  {
    id: 2,
    title: "Best Build Combinations for Assassins",
    slug: "best-assassin-builds",
    excerpt: "Optimize your assassin gameplay with these proven build combinations and strategies.",
    status: "published",
    author: {
      name: "Jane Smith",
      avatar: "/avatars/02.png"
    },
    publishedAt: "2025-01-18T14:30:00Z",
    views: 8932,
    comments: 67,
    categories: ["Builds", "Assassins"],
    tags: ["assassin", "builds", "items", "strategy"]
  },
  {
    id: 3,
    title: "Tank Heroes: When and How to Pick",
    slug: "tank-heroes-guide",
    excerpt: "Learn the art of tank selection and positioning to become the backbone of your team.",
    status: "draft",
    author: {
      name: "Mike Johnson",
      avatar: "/avatars/03.png"
    },
    publishedAt: null,
    views: 0,
    comments: 0,
    categories: ["Guides", "Tank"],
    tags: ["tank", "positioning", "team-composition"]
  },
  {
    id: 4,
    title: "Understanding Map Control and Objectives",
    slug: "map-control-objectives",
    excerpt: "Master the strategic elements of MLBB with this comprehensive guide to map control.",
    status: "scheduled",
    author: {
      name: "Sarah Wilson",
      avatar: "/avatars/04.png"
    },
    publishedAt: "2025-01-25T09:00:00Z",
    views: 0,
    comments: 0,
    categories: ["Strategy", "Advanced"],
    tags: ["strategy", "map-control", "objectives", "advanced"]
  }
]

function getStatusBadge(status: BlogPost["status"]) {
  switch (status) {
    case "published":
      return <Badge variant="default">Published</Badge>
    case "draft":
      return <Badge variant="secondary">Draft</Badge>
    case "scheduled":
      return <Badge variant="outline">Scheduled</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export function BlogManagement() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === "all" || post.status === activeTab
    
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
          <p className="text-muted-foreground">
            Create, edit, and manage your blog posts and content.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPosts.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPosts.filter(p => p.status === "published").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active posts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPosts.reduce((total, post) => total + post.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPosts.reduce((total, post) => total + post.comments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>
                Manage your blog posts, drafts, and scheduled content.
              </CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {post.excerpt.slice(0, 60)}...
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{post.author.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
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
                  <TableCell>{formatDate(post.publishedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

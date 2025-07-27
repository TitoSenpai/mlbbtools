"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search,
  Calendar,
  Clock,
  Tag,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Eye,
  Share2
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
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  publishedAt: string
  readTime: number
  views: number
  comments: number
  categories: string[]
  tags: string[]
  featuredImage: string
  featured: boolean
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "Complete Guide to Meta Heroes in Season 30",
    slug: "meta-heroes-season-30-guide",
    excerpt: "Discover the most powerful heroes dominating the current meta and learn how to master them effectively in ranked games.",
    content: "Full content here...",
    author: {
      name: "John Doe",
      avatar: "/avatars/01.png",
      bio: "Professional MLBB player and content creator"
    },
    publishedAt: "2025-01-20T10:00:00Z",
    readTime: 8,
    views: 12540,
    comments: 89,
    categories: ["Guides", "Meta"],
    tags: ["heroes", "meta", "season30", "guide"],
    featuredImage: "/blog/meta-heroes.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Best Build Combinations for Assassins",
    slug: "best-assassin-builds",
    excerpt: "Optimize your assassin gameplay with these proven build combinations that will help you carry games.",
    content: "Full content here...",
    author: {
      name: "Jane Smith",
      avatar: "/avatars/02.png",
      bio: "MLBB strategist and guide writer"
    },
    publishedAt: "2025-01-18T14:30:00Z",
    readTime: 6,
    views: 8932,
    comments: 67,
    categories: ["Builds", "Assassins"],
    tags: ["assassin", "builds", "items", "strategy"],
    featuredImage: "/blog/assassin-builds.jpg",
    featured: false
  },
  {
    id: 3,
    title: "Understanding Map Control and Objectives",
    slug: "map-control-objectives",
    excerpt: "Master the strategic elements of MLBB with this comprehensive guide to map control and objective prioritization.",
    content: "Full content here...",
    author: {
      name: "Mike Johnson",
      avatar: "/avatars/03.png",
      bio: "Former pro player and team coach"
    },
    publishedAt: "2025-01-15T09:00:00Z",
    readTime: 12,
    views: 7234,
    comments: 45,
    categories: ["Strategy", "Advanced"],
    tags: ["strategy", "map-control", "objectives", "advanced"],
    featuredImage: "/blog/map-control.jpg",
    featured: false
  },
  {
    id: 4,
    title: "Top 10 Tank Heroes for Solo Queue",
    slug: "top-tank-heroes-solo-queue",
    excerpt: "Learn which tank heroes are most effective for climbing ranked in solo queue and how to play them.",
    content: "Full content here...",
    author: {
      name: "Sarah Wilson",
      avatar: "/avatars/04.png",
      bio: "Mythical Glory tank main"
    },
    publishedAt: "2025-01-12T16:00:00Z",
    readTime: 7,
    views: 5876,
    comments: 34,
    categories: ["Guides", "Tank", "Ranked"],
    tags: ["tank", "solo-queue", "ranked", "heroes"],
    featuredImage: "/blog/tank-heroes.jpg",
    featured: false
  }
]

const categories = [
  { name: "Guides", count: 45 },
  { name: "Meta", count: 23 },
  { name: "Builds", count: 34 },
  { name: "Strategy", count: 28 },
  { name: "Heroes", count: 67 },
  { name: "Ranked", count: 19 }
]

const popularTags = [
  "heroes", "meta", "builds", "strategy", "assassin", "tank", "mage", 
  "marksman", "support", "jungle", "solo-queue", "team-composition"
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Card className={`overflow-hidden ${featured ? "col-span-2" : ""}`}>
      <div className={`${featured ? "md:flex" : ""}`}>
        <div className={`relative ${featured ? "md:w-1/2" : ""}`}>
          <div className={`${featured ? "h-64 md:h-full" : "h-48"} bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center`}>
            <span className="text-white text-lg font-bold">Featured Image</span>
          </div>
          {post.featured && (
            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
              Featured
            </Badge>
          )}
        </div>
        <div className={`${featured ? "md:w-1/2" : ""}`}>
          <CardHeader>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <time>{formatDate(post.publishedAt)}</time>
              <Separator orientation="vertical" className="h-4" />
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            <CardTitle className={`${featured ? "text-xl" : "text-lg"} line-clamp-2`}>
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                {post.title}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {post.excerpt}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.views.toLocaleString()}
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{post.author.name}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export function BlogHomepage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const featuredPost = mockPosts.find(post => post.featured)
  const regularPosts = mockPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold">MLBB Tools Blog</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Your ultimate source for Mobile Legends guides, strategies, and updates
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Post */}
            {featuredPost && (
              <section>
                <div className="flex items-center mb-6">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <h2 className="text-2xl font-bold">Featured Article</h2>
                </div>
                <BlogPostCard post={featuredPost} featured />
              </section>
            )}

            {/* Recent Posts */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="flex justify-center">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={`/blog/category/${category.name.toLowerCase()}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span>{category.name}</span>
                      <Badge variant="secondary">{category.count}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link key={tag} href={`/blog/tag/${tag}`}>
                      <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
                <CardDescription>
                  Get the latest MLBB guides and strategies delivered to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter your email" type="email" />
                <Button className="w-full">Subscribe</Button>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle>Share This Blog</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Blog
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

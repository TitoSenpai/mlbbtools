"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Sword, Shield, Zap, Target, Users, Eye } from "lucide-react"
import { hasDetailedData } from "@/data/detailed-heroes"

interface Hero {
  id: number
  name: string
  role: string
  difficulty: number
  win_rate: number
  pick_rate: number
  ban_rate: number
  is_active: boolean
}

const roleIcons = {
  'Assassin': Sword,
  'Tank': Shield,
  'Mage': Zap,
  'Marksman': Target,
  'Support': Users,
  'Fighter': Sword,
}

const roleColors = {
  'Assassin': 'bg-red-100 text-red-800',
  'Tank': 'bg-blue-100 text-blue-800',
  'Mage': 'bg-purple-100 text-purple-800',
  'Marksman': 'bg-orange-100 text-orange-800',
  'Support': 'bg-green-100 text-green-800',
  'Fighter': 'bg-yellow-100 text-yellow-800',
}

export function HeroesManagement() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHero, setEditingHero] = useState<Hero | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    difficulty: 1,
    win_rate: 50,
    pick_rate: 10,
    ban_rate: 5,
    is_active: true
  })

  useEffect(() => {
    fetchHeroes()
  }, [])

  const fetchHeroes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/mlbb?action=get-heroes')
      const data = await response.json() as { success: boolean; data: Hero[]; error?: string }
      
      if (data.success) {
        setHeroes(data.data)
      } else {
        console.error('Failed to fetch heroes:', data.error)
      }
    } catch (error) {
      console.error('Error fetching heroes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHeroes = heroes.filter(hero => {
    const matchesSearch = hero.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || hero.role === selectedRole
    return matchesSearch && matchesRole
  })

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      difficulty: 1,
      win_rate: 50,
      pick_rate: 10,
      ban_rate: 5,
      is_active: true
    })
    setEditingHero(null)
  }

  const handleEdit = (hero: Hero) => {
    setEditingHero(hero)
    setFormData({
      name: hero.name,
      role: hero.role,
      difficulty: hero.difficulty,
      win_rate: hero.win_rate,
      pick_rate: hero.pick_rate,
      ban_rate: hero.ban_rate,
      is_active: hero.is_active
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit to your API
    console.log('Submitting hero data:', formData)
    
    // Mock success - in reality this would be an API call
    if (editingHero) {
      // Update existing hero
      setHeroes(heroes.map(hero => 
        hero.id === editingHero.id 
          ? { ...hero, ...formData }
          : hero
      ))
    } else {
      // Add new hero
      const newHero: Hero = {
        id: Math.max(...heroes.map(h => h.id), 0) + 1,
        ...formData
      }
      setHeroes([...heroes, newHero])
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleDelete = async (heroId: number) => {
    if (confirm('Are you sure you want to delete this hero?')) {
      // Mock delete - in reality this would be an API call
      setHeroes(heroes.filter(hero => hero.id !== heroId))
    }
  }

  const getRoleIcon = (role: string) => {
    const Icon = roleIcons[role as keyof typeof roleIcons] || Sword
    return <Icon className="w-4 h-4" />
  }

  const getRoleColor = (role: string) => {
    return roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'bg-green-100 text-green-800'
    if (difficulty <= 6) return 'bg-yellow-100 text-yellow-800'
    if (difficulty <= 8) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return 'Easy'
    if (difficulty <= 6) return 'Medium'
    if (difficulty <= 8) return 'Hard'
    return 'Expert'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Heroes Management</h1>
          <p className="text-muted-foreground">
            Manage MLBB heroes, their statistics, and game balance data
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hero
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingHero ? 'Edit Hero' : 'Add New Hero'}
                </DialogTitle>
                <DialogDescription>
                  {editingHero 
                    ? 'Update hero information and statistics'
                    : 'Add a new hero to the MLBB roster'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({...formData, role: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assassin">Assassin</SelectItem>
                      <SelectItem value="Tank">Tank</SelectItem>
                      <SelectItem value="Mage">Mage</SelectItem>
                      <SelectItem value="Marksman">Marksman</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Fighter">Fighter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="difficulty" className="text-right">
                    Difficulty
                  </Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: parseInt(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="win_rate" className="text-right">
                    Win Rate %
                  </Label>
                  <Input
                    id="win_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.win_rate}
                    onChange={(e) => setFormData({...formData, win_rate: parseFloat(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pick_rate" className="text-right">
                    Pick Rate %
                  </Label>
                  <Input
                    id="pick_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.pick_rate}
                    onChange={(e) => setFormData({...formData, pick_rate: parseFloat(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ban_rate" className="text-right">
                    Ban Rate %
                  </Label>
                  <Input
                    id="ban_rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.ban_rate}
                    onChange={(e) => setFormData({...formData, ban_rate: parseFloat(e.target.value)})}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingHero ? 'Update Hero' : 'Add Hero'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Heroes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{heroes.length}</div>
            <p className="text-xs text-muted-foreground">
              Active roster size
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {heroes.length > 0 
                ? (heroes.reduce((acc, hero) => acc + hero.win_rate, 0) / heroes.length).toFixed(1)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall balance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Picked Role</CardTitle>
            <Sword className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {heroes.length > 0 
                ? (() => {
                    const rolePickRates = heroes.reduce((acc, hero) => {
                      acc[hero.role] = (acc[hero.role] || 0) + hero.pick_rate
                      return acc
                    }, {} as Record<string, number>)
                    
                    const topRole = Object.entries(rolePickRates)
                      .sort(([,a], [,b]) => b - a)[0]
                    
                    return topRole ? topRole[0] : 'N/A'
                  })()
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              By total pick rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Difficulty</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {heroes.length > 0 
                ? (heroes.reduce((acc, hero) => acc + hero.difficulty, 0) / heroes.length).toFixed(1)
                : 0
              }/10
            </div>
            <p className="text-xs text-muted-foreground">
              Learning curve
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Roster</CardTitle>
          <CardDescription>
            Manage and track performance statistics for all MLBB heroes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search heroes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Assassin">Assassin</SelectItem>
                <SelectItem value="Tank">Tank</SelectItem>
                <SelectItem value="Mage">Mage</SelectItem>
                <SelectItem value="Marksman">Marksman</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="Fighter">Fighter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading heroes...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hero</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Pick Rate</TableHead>
                  <TableHead>Ban Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHeroes.map((hero) => (
                  <TableRow key={hero.id}>
                    <TableCell className="font-medium">
                      {hasDetailedData(hero.name) ? (
                        <Link 
                          href={`/dashboard/heroes/${hero.name.toLowerCase()}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {hero.name}
                        </Link>
                      ) : (
                        <span>{hero.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getRoleColor(hero.role)}>
                        <span className="mr-1">{getRoleIcon(hero.role)}</span>
                        {hero.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getDifficultyColor(hero.difficulty)}>
                        {hero.difficulty}/10 ({getDifficultyLabel(hero.difficulty)})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={hero.win_rate > 50 ? 'text-green-600' : 'text-red-600'}>
                        {hero.win_rate.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>{hero.pick_rate.toFixed(1)}%</TableCell>
                    <TableCell>{hero.ban_rate.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge variant={hero.is_active ? "default" : "secondary"}>
                        {hero.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {hasDetailedData(hero.name) && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/dashboard/heroes/${hero.name.toLowerCase()}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(hero)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(hero.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHeroes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm || selectedRole !== "all" 
                        ? "No heroes match your search criteria" 
                        : "No heroes found"
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

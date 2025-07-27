'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Shield, Sword, Zap, Target, Star, Clock, Gauge } from 'lucide-react'
import Link from 'next/link'
import { DetailedHero } from '@/data/detailed-heroes'

interface HeroProfileProps {
  hero: DetailedHero
}

export function HeroProfile({ hero }: HeroProfileProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-8">
          <Link 
            href="/dashboard/heroes" 
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Heroes Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Hero Portrait */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <span className="text-6xl md:text-7xl font-bold text-white/80">
                  {hero.name.charAt(0)}
                </span>
              </div>
            </div>
            
            {/* Hero Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold">{hero.name}</h1>
                <Badge variant="secondary" className="text-sm">
                  {hero.role}
                </Badge>
              </div>
              <p className="text-xl text-blue-200 mb-4">{hero.title}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {hero.specialty.map((spec) => (
                  <Badge key={spec} variant="outline" className="border-white/30 text-white">
                    {spec}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Release Date</p>
                  <p className="font-semibold">{hero.releaseDate}</p>
                </div>
                <div>
                  <p className="text-blue-200">Lane</p>
                  <p className="font-semibold">{hero.lane}</p>
                </div>
                <div>
                  <p className="text-blue-200">Damage Type</p>
                  <p className="font-semibold">{hero.damageType}</p>
                </div>
                <div>
                  <p className="text-blue-200">Range</p>
                  <p className="font-semibold">{hero.basicAttackType}</p>
                </div>
              </div>
            </div>
            
            {/* Ratings */}
            <div className="flex-shrink-0">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ratings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Durability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={hero.ratings.durability * 10} className="w-16 h-2" />
                      <span className="text-sm font-bold w-4">{hero.ratings.durability}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4" />
                      <span className="text-sm">Offense</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={hero.ratings.offense * 10} className="w-16 h-2" />
                      <span className="text-sm font-bold w-4">{hero.ratings.offense}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={hero.ratings.controlEffects * 10} className="w-16 h-2" />
                      <span className="text-sm font-bold w-4">{hero.ratings.controlEffects}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Difficulty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={hero.ratings.difficulty * 10} className="w-16 h-2" />
                      <span className="text-sm font-bold w-4">{hero.ratings.difficulty}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="abilities" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="abilities">Abilities</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="lore">Lore</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          {/* Abilities Tab */}
          <TabsContent value="abilities" className="space-y-6">
            <div className="grid gap-6">
              {hero.abilities.map((ability, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                            ability.type === 'Passive' ? 'bg-green-500' :
                            ability.type === 'Skill 1' ? 'bg-blue-500' :
                            ability.type === 'Skill 2' ? 'bg-purple-500' :
                            'bg-red-500'
                          }`}>
                            {ability.type === 'Passive' ? 'P' :
                             ability.type === 'Skill 1' ? '1' :
                             ability.type === 'Skill 2' ? '2' : 'R'}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">{ability.name}</h3>
                            <p className="text-sm text-gray-500">{ability.type}</p>
                          </div>
                        </CardTitle>
                      </div>
                      <div className="text-right text-sm space-y-1">
                        {ability.cooldown && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{ability.cooldown}</span>
                          </div>
                        )}
                        {ability.manaCost && (
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3 h-3" />
                            <span>{ability.manaCost}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 mb-4">{ability.description}</p>
                    
                    {ability.damage && (
                      <div className="mb-3">
                        <span className="font-semibold text-red-600">Damage: </span>
                        <span>{ability.damage}</span>
                      </div>
                    )}
                    
                    {ability.effects && ability.effects.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {ability.effects.map((effect, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Base Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Base Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Health Points</span>
                      <span className="font-mono">{hero.stats.hp.base} → {hero.stats.hp.max}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>HP Regeneration</span>
                      <span className="font-mono">{hero.stats.hpRegen.base} → {hero.stats.hpRegen.max}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mana</span>
                      <span className="font-mono">{hero.stats.mana.base} → {hero.stats.mana.max}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mana Regeneration</span>
                      <span className="font-mono">{hero.stats.manaRegen.base} → {hero.stats.manaRegen.max}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Combat Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Combat Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Physical Attack</span>
                      <span className="font-mono">{hero.stats.physicalAttack.base} → {hero.stats.physicalAttack.max}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Physical Defense</span>
                      <span className="font-mono">{hero.stats.physicalDefense.base} → {hero.stats.physicalDefense.max}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Magic Defense</span>
                      <span className="font-mono">{hero.stats.magicDefense.base} → {hero.stats.magicDefense.max}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Attack Speed</span>
                      <span className="font-mono">{hero.stats.attackSpeed.base} → {hero.stats.attackSpeed.max}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Special Stats */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Special Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{hero.stats.criticalDamage}%</div>
                      <div className="text-sm text-gray-600">Critical Damage</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{hero.stats.movementSpeed}</div>
                      <div className="text-sm text-gray-600">Movement Speed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{hero.stats.basicAttackRange}</div>
                      <div className="text-sm text-gray-600">Attack Range</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Lore Tab */}
          <TabsContent value="lore" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Background</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{hero.lore.background}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{hero.lore.story}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Purchase Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Battle Points</span>
                    <span className="font-semibold">{hero.price.battlePoints.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diamonds</span>
                    <span className="font-semibold">{hero.price.diamonds}</span>
                  </div>
                  {hero.price.tickets && (
                    <div className="flex justify-between">
                      <span>Tickets</span>
                      <span className="font-semibold">{hero.price.tickets}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Relationships */}
              <Card>
                <CardHeader>
                  <CardTitle>Relationships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {hero.relationships.map((relationship, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        {relationship}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Voice Actors */}
              <Card>
                <CardHeader>
                  <CardTitle>Voice Actors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hero.voiceActors.english && (
                    <div className="flex justify-between">
                      <span>English</span>
                      <span className="font-semibold">{hero.voiceActors.english}</span>
                    </div>
                  )}
                  {hero.voiceActors.japanese && (
                    <div className="flex justify-between">
                      <span>Japanese</span>
                      <span className="font-semibold">{hero.voiceActors.japanese}</span>
                    </div>
                  )}
                  {hero.voiceActors.chinese && (
                    <div className="flex justify-between">
                      <span>Chinese</span>
                      <span className="font-semibold">{hero.voiceActors.chinese}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Trivia */}
              <Card>
                <CardHeader>
                  <CardTitle>Trivia</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {hero.trivia.map((fact, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

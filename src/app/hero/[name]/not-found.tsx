import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default function HeroNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Hero Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            The hero profile you&apos;re looking for doesn&apos;t exist or detailed information is not yet available.
          </p>
          <p className="text-sm text-gray-500">
            We&apos;re constantly adding more detailed hero profiles. Check back soon!
          </p>
          <Button asChild className="w-full">
            <Link href="/dashboard/heroes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Heroes List
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

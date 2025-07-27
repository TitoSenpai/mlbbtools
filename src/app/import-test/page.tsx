'use client'

import { useState } from 'react'
import { importAllHeroes } from '@/lib/import-heroes'
import { allMLBBHeroes } from '@/data/heroes-data'

export default function ImportTestPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; imported: number; skipped: number; errors: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setImporting(true)
    setError(null)
    setResult(null)

    try {
      const importResult = await importAllHeroes()
      setResult(importResult)
      console.log('Import completed:', importResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Import failed:', err)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Hero Import Test</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Import Statistics</h2>
        <p>Total heroes to import: <strong>{allMLBBHeroes.length}</strong></p>
        <div className="mt-2">
          <p>Heroes by role:</p>
          <ul className="list-disc list-inside ml-4">
            <li>Assassin: {allMLBBHeroes.filter(h => h.role === 'Assassin').length}</li>
            <li>Tank: {allMLBBHeroes.filter(h => h.role === 'Tank').length}</li>
            <li>Mage: {allMLBBHeroes.filter(h => h.role === 'Mage').length}</li>
            <li>Marksman: {allMLBBHeroes.filter(h => h.role === 'Marksman').length}</li>
            <li>Support: {allMLBBHeroes.filter(h => h.role === 'Support').length}</li>
            <li>Fighter: {allMLBBHeroes.filter(h => h.role === 'Fighter').length}</li>
          </ul>
        </div>
      </div>

      <button
        onClick={handleImport}
        disabled={importing}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {importing ? 'Importing Heroes...' : 'Import All Heroes'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold">Import Result:</h3>
          <pre className="text-green-700 text-sm mt-2 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

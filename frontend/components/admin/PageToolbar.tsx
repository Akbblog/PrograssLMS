"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Download } from 'lucide-react'

interface Props {
  onAdd?: () => void
  onExport?: () => void
  query?: string
  setQuery?: (q: string) => void
  showFilters?: boolean
}

export default function PageToolbar({ onAdd, onExport, query, setQuery }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" value={query} onChange={(e: any) => setQuery?.(e.target.value)} />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {onAdd && (
          <Button onClick={onAdd}>
            Add
          </Button>
        )}
      </div>
    </div>
  )
}

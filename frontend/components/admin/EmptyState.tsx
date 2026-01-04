"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FilePlus } from 'lucide-react'

export default function EmptyState({ title, description, cta }: { title: string; description?: string; cta?: React.ReactNode }) {
  return (
    <Card className="border-dashed border-2 border-slate-200 rounded-lg">
      <CardContent className="py-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
            <FilePlus className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        {cta && <div className="mt-4">{cta}</div>}
      </CardContent>
    </Card>
  )
}

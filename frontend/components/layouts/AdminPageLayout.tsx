"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  description?: string
  actions?: React.ReactNode
  stats?: React.ReactNode
  children?: React.ReactNode
}

export default function AdminPageLayout({ title, description, actions, stats, children }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats}</div>
      )}

      <div className="space-y-6">{children}</div>
    </div>
  )
}

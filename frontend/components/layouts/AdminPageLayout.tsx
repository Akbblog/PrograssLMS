"use client"

import React from 'react'

interface Props {
  title: string
  description?: string
  actions?: React.ReactNode
  stats?: React.ReactNode
  children?: React.ReactNode
}

export default function AdminPageLayout({ title, description, actions, stats, children }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
        )}
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">{stats}</div>
      )}

      {/* Page Content */}
      <div className="space-y-6">{children}</div>
    </div>
  )
}

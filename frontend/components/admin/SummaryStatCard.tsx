"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  value: string | number
  icon?: React.ReactNode
  variant?: 'blue' | 'purple' | 'green' | 'orange'
}

const VARIANT_STYLES: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600 text-white',
  purple: 'from-purple-500 to-purple-600 text-white',
  green: 'from-green-500 to-green-600 text-white',
  orange: 'from-orange-500 to-red-500 text-white',
}

export default function SummaryStatCard({ title, value, icon, variant = 'blue' }: Props) {
  const cls = VARIANT_STYLES[variant] || VARIANT_STYLES.blue
  return (
    <Card className={`bg-gradient-to-br ${cls} border-0 shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  )
}

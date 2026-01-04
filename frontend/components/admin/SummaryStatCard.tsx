"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  value: string | number
  icon?: React.ReactNode
  variant?: 'blue' | 'purple' | 'green' | 'orange'
  trend?: string
}

const VARIANT_STYLES: Record<string, { gradient: string; iconBg: string }> = {
  blue: { 
    gradient: 'from-blue-500 to-blue-600', 
    iconBg: 'bg-white/20' 
  },
  purple: { 
    gradient: 'from-purple-500 to-purple-600', 
    iconBg: 'bg-white/20' 
  },
  green: { 
    gradient: 'from-emerald-500 to-emerald-600', 
    iconBg: 'bg-white/20' 
  },
  orange: { 
    gradient: 'from-orange-500 to-red-500', 
    iconBg: 'bg-white/20' 
  },
}

export default function SummaryStatCard({ title, value, icon, variant = 'blue', trend }: Props) {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.blue
  
  return (
    <Card className={`bg-gradient-to-br ${styles.gradient} text-white border-0 shadow-lg overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-medium text-white/90 uppercase tracking-wide">{title}</CardTitle>
        <div className={`h-10 w-10 rounded-lg ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="text-3xl font-bold text-white leading-tight">{value}</div>
        {trend && (
          <div className="text-xs font-medium text-white/80 mt-1">{trend}</div>
        )}
      </CardContent>
    </Card>
  )
}

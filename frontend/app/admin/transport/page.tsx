"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { Card, CardContent } from "@/components/ui/card"
import { Bus, Route, Users, ChevronRight } from "lucide-react"

export default function TransportPage() {
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    fetch('/api/v1/transport/stats')
      .then(r => r.json())
      .then(d => setStats(d.data || {}))
      .catch(() => {})
  }, [])

  const transportLinks = [
    { href: "/admin/transport/vehicles", title: "Vehicles", description: "Manage school vehicles", icon: Bus },
    { href: "/admin/transport/routes", title: "Routes", description: "Configure transport routes", icon: Route },
    { href: "/admin/transport/allocations", title: "Allocations", description: "Assign students to routes", icon: Users },
  ]

  return (
    <AdminPageLayout 
      title="Transport" 
      description="Manage vehicles, routes & allocations"
      stats={(
        <>
          <SummaryStatCard title="Active Vehicles" value={stats?.activeVehicles || 0} icon={<Bus className="h-4 w-4 text-white" />} variant="blue" />
          <SummaryStatCard title="Active Routes" value={stats?.activeRoutes || 0} icon={<Route className="h-4 w-4 text-white" />} variant="green" />
          <SummaryStatCard title="Students Using" value={stats?.studentsUsing || 0} icon={<Users className="h-4 w-4 text-white" />} variant="purple" />
        </>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {transportLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <link.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AdminPageLayout>
  )
}

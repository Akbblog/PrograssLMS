"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'

export default function TransportPage() {
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    fetch('/api/v1/transport/stats')
      .then(r => r.json())
      .then(d => setStats(d.data || {}))
      .catch(() => {})
  }, [])

  return (
    <AdminPageLayout title="Transport" description="Manage vehicles, routes & allocations">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryStatCard title="Active Vehicles" value={stats?.activeVehicles || 0} icon={<></>} variant="blue" />
          <SummaryStatCard title="Active Routes" value={stats?.activeRoutes || 0} icon={<></>} variant="green" />
          <SummaryStatCard title="Students Using" value={stats?.studentsUsing || 0} icon={<></>} variant="purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/transport/vehicles" className="p-4 bg-slate-50 rounded-lg text-center">Vehicles</a>
          <a href="/admin/transport/routes" className="p-4 bg-slate-50 rounded-lg text-center">Routes</a>
          <a href="/admin/transport/allocations" className="p-4 bg-slate-50 rounded-lg text-center">Allocations</a>
        </div>
      </div>
    </AdminPageLayout>
  )
}

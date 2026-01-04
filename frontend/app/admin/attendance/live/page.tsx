"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { io } from 'socket.io-client'

export default function LivePage() {
  const [stats, setStats] = useState({ totalToday: 0 })

  useEffect(() => {
    fetch('/api/v1/attendance/live-stats').then(r=>r.json()).then(d=>setStats({ totalToday: d.data.totalToday }))

    let socket: any = null;
    socket = io();
    socket.on('attendance:marked', (payload: any) => {
      setStats((s: any) => ({ ...s, totalToday: s.totalToday + 1 }))
    })

    return () => { socket?.disconnect && socket.disconnect(); };
  }, [])

  return (
    <AdminPageLayout title="Live Attendance" description="Real-time attendance updates">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryStatCard title="Today" value={stats.totalToday} icon={<></>} variant="blue" />
          <SummaryStatCard title="Present" value={stats.totalToday} icon={<></>} variant="green" />
          <SummaryStatCard title="Overdue" value={0} icon={<></>} variant="purple" />
        </div>
      </div>
    </AdminPageLayout>
  )
}

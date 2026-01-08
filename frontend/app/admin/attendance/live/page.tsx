"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { attendanceAPI } from '@/lib/api/endpoints'

export default function LivePage() {
  const [stats, setStats] = useState({ totalToday: 0 })

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res: any = await attendanceAPI.getLiveStats();
        const totalToday = (res as any)?.data?.totalToday;
        if (!cancelled) {
          setStats({ totalToday: typeof totalToday === 'number' ? totalToday : 0 });
        }
      } catch {
        if (!cancelled) setStats({ totalToday: 0 });
      }
    })();

    // Socket.IO is not available on Vercel serverless backend; only connect
    // when an explicit socket URL is provided.
    let socket: any = null;
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (socketUrl) {
      import('socket.io-client')
        .then(({ io }) => {
          if (cancelled) return;
          socket = io(socketUrl, { transports: ['polling'] });
          socket.on('attendance:marked', () => {
            setStats((s: any) => ({ ...s, totalToday: (s?.totalToday || 0) + 1 }));
          });
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      socket?.disconnect && socket.disconnect();
    };
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

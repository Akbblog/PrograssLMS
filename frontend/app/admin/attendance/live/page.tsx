"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { attendanceAPI, adminAPI } from '@/lib/api/endpoints'
import LiveAttendanceFeed from './LiveAttendanceFeed'
import AttendanceToast from './AttendanceToast'

export default function LivePage() {
  const [stats, setStats] = useState({ totalToday: 0 })
  const [records, setRecords] = useState<any[]>([])
  const [toastRecord, setToastRecord] = useState<any | null>(null)

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

      // Fetch initial recent scans
      try {
        const recentRes: any = await attendanceAPI.getRecentScans();
        const recent = recentRes?.data || recentRes || [];
        if (!cancelled) setRecords(recent);
      } catch (e) {
        if (!cancelled) setRecords([]);
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
          socket.on('attendance:marked', async (payload: any) => {
            try {
              let record = payload;

              // Backend should now send populated student details; fallback to fetching student
              if (!record.student || (typeof record.student === 'object' && !record.student.name)) {
                try {
                  const studentRes: any = await adminAPI.getStudent(record.student);
                  record.student = studentRes?.data || record.student;
                } catch (_err) {
                  // ignore
                }
              }

              const newItem = {
                _id: record.attendanceId,
                ...record
              };

              setRecords((prev) => [newItem, ...(prev || [])].slice(0, 50));
              setStats((s: any) => ({ ...s, totalToday: (s?.totalToday || 0) + 1 }));
              setToastRecord(newItem);

            } catch (e) {
              console.warn('Failed to process attendance:marked payload', e);
            }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryStatCard title="Today" value={stats.totalToday} icon={<></>} variant="blue" />
          <SummaryStatCard title="Present" value={stats.totalToday} icon={<></>} variant="green" />
          <SummaryStatCard title="Overdue" value={0} icon={<></>} variant="purple" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Recent Scans</h3>
            <LiveAttendanceFeed records={records} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Live Feed</h3>
            {/* future: charts or stats */}
            <div className="text-sm text-gray-500">Updates appear live as students scan in.</div>
          </div>
        </div>
      </div>

      {toastRecord && <AttendanceToast record={toastRecord} onClose={() => setToastRecord(null)} />}
    </AdminPageLayout>
  )
}

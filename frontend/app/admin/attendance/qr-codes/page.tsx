"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'
import { unwrapArray } from '@/lib/utils'
import api, { attendanceAPI } from '@/lib/api/endpoints'

export default function QRCodesPage() {
  const [qrs, setQrs] = useState<any[]>([])

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res: any = await api.get('/attendance/recent-scans');
        const list = unwrapArray((res as any)?.data ?? res, 'qrs');
        if (!cancelled) setQrs(list);
      } catch {
        if (!cancelled) setQrs([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [])

  return (
    <AdminPageLayout title="QR Codes" description="Generate and manage student QR codes">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex gap-2">
          <Button onClick={async () => {
            const studentId = prompt('Student ID');
            if (!studentId) return;
            await api.post(`/attendance/qr/generate/${studentId}`);
            alert('Generated');
          }}>Generate QR</Button>
        </div>

        <div>
          <h3 className="font-bold">Recent Scans</h3>
          <div className="space-y-2 mt-2">
            {qrs.map(q => (
              <div key={q._id} className="p-3 border rounded">
                <div className="text-sm font-bold">{q.student?.name || q.student}</div>
                <div className="text-xs text-slate-500">{new Date(q.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  )
}

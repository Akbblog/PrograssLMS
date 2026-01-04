"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function QRCodesPage() {
  const [qrs, setQrs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/v1/attendance/recent-scans').then(r=>r.json()).then(d=>setQrs(d.data || []))
  }, [])

  return (
    <AdminPageLayout title="QR Codes" description="Generate and manage student QR codes">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex gap-2">
          <Button onClick={async () => {
            const studentId = prompt('Student ID');
            if (!studentId) return;
            const res = await fetch(`/api/v1/attendance/qr/generate/${studentId}`, { method: 'POST' });
            const d = await res.json();
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

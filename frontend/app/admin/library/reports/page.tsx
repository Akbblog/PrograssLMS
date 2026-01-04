"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/v1/library/stats')
      .then(r => r.json())
      .then(d => setStats(d.data || {}))
      .catch(() => {})
  }, [])

  return (
    <AdminPageLayout title="Library Reports" description="Insights and analytics">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.mostBorrowed?.length === 0 && <p className="text-sm text-slate-500">No data yet.</p>}
            {stats?.mostBorrowed?.map((m:any) => (
              <div key={m.book?._id} className="py-2 border-b last:border-b-0">
                <div className="font-bold">{m.book?.title} ({m.count})</div>
                <div className="text-xs text-slate-500">Author: {m.book?.author}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}

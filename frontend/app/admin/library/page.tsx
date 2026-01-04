"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SummaryStatCard from '@/components/admin/SummaryStatCard'
import { Book, BookOpen, AlertCircle } from 'lucide-react'

export default function LibraryAdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/library/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminPageLayout
      title="Library"
      description="Manage library inventory and circulation"
      actions={null}
      stats={(
        <>
          <SummaryStatCard title="Total Books" value={stats?.totalBooks || 0} icon={<Book className="h-4 w-4 text-white" />} variant="blue" />
          <SummaryStatCard title="Currently Issued" value={stats?.issuedCount || 0} icon={<BookOpen className="h-4 w-4 text-white" />} variant="green" />
          <SummaryStatCard title="Overdue" value={stats?.overdueCount || 0} icon={<AlertCircle className="h-4 w-4 text-white" />} variant="purple" />
        </>
      )}
    >
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">Recent issues & returns will appear here (coming soon).</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/library/books" className="p-4 bg-slate-50 rounded-lg text-center">Books</a>
          <a href="/admin/library/issue" className="p-4 bg-slate-50 rounded-lg text-center">Issue / Return</a>
          <a href="/admin/library/reports" className="p-4 bg-slate-50 rounded-lg text-center">Reports</a>
        </div>
      </div>
    </AdminPageLayout>
  )
}

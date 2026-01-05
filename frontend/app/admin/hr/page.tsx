"use client"

import React from 'react'
import Link from 'next/link'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import SummaryStatCard from '@/components/admin/SummaryStatCard'

export default function HRPage(){
  return (
    <AdminPageLayout title="HR" description="Staff, leaves, payroll and appraisals">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryStatCard title="Staff" value={0} icon={<></>} variant="blue" />
          <SummaryStatCard title="Pending Leaves" value={0} icon={<></>} variant="purple" />
          <SummaryStatCard title="Payroll" value={0} icon={<></>} variant="green" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/hr/staff-directory" className="p-4 bg-slate-50 rounded-lg text-center">
            Staff Directory
          </Link>
          <Link href="/admin/hr/payroll" className="p-4 bg-slate-50 rounded-lg text-center">
            Payroll
          </Link>
          <Link href="/admin/hr/performance" className="p-4 bg-slate-50 rounded-lg text-center">
            Performance Reviews
          </Link>
          <Link href="/admin/hr/leave" className="p-4 bg-slate-50 rounded-lg text-center">
            Leave Management
          </Link>
        </div>
      </div>
    </AdminPageLayout>
  )
}
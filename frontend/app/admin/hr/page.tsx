"use client"

import React from 'react'
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
      </div>
    </AdminPageLayout>
  )
}
"use client"

import React from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'

export default function DocumentsPage(){
  return (
    <AdminPageLayout title="Documents" description="Generate printable documents">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <a href="/admin/documents/templates" className="p-4 bg-slate-50 rounded">Manage Templates</a>
          <a href="/admin/documents/generate" className="p-4 bg-slate-50 rounded">Generate Document</a>
        </div>
      </div>
    </AdminPageLayout>
  )
}
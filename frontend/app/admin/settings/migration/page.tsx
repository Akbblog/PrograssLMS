"use client"

import React from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function MigrationPage(){
  return (
    <AdminPageLayout title="Migration" description="Upload Excel/CSV and map fields">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <p className="text-sm text-slate-500">Migration wizard placeholder: upload, map, validate, execute.</p>
        <div className="flex gap-2"><Button onClick={()=>alert('Upload placeholder')}>Upload File</Button></div>
      </div>
    </AdminPageLayout>
  )
}
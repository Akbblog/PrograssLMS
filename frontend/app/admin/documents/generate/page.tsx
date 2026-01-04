"use client"

import React from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function GeneratePage(){
  return (
    <AdminPageLayout title="Generate Document" description="Create and preview documents">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <p className="text-sm text-slate-500">Select a document type and target entity to generate a PDF. (Placeholder UI)</p>
        <div className="flex gap-2"><Button onClick={()=>alert('Generate placeholder')}>Generate</Button></div>
      </div>
    </AdminPageLayout>
  )
}
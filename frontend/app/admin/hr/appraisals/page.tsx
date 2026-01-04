"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function AppraisalsPage(){
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ fetch('/api/v1/hr/appraisals').then(r=>r.json()).then(d=>setItems(d.data||[])).catch(()=>{}) },[])
  return (
    <AdminPageLayout title="Appraisals" description="Manage staff appraisals">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4"><Button onClick={()=>alert('Create placeholder')}>Create Appraisal</Button></div>
        <div>
          {items.map(i=> (
            <div key={i._id} className="p-3 border rounded mb-2">
              <div className="font-bold">{i.staff?.name || i.staff} - {i.academicYear}</div>
              <div className="text-xs text-slate-500">Status: {i.status}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  )
}
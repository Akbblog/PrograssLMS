"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function LeavesPage(){
  const [leaves, setLeaves] = useState<any[]>([])
  useEffect(()=>{ fetch('/api/v1/hr/leaves').then(r=>r.json()).then(d=>setLeaves(d.data||[])).catch(()=>{}) },[])
  return (
    <AdminPageLayout title="Leaves" description="Apply and manage leaves">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4"><Button onClick={()=>alert('Apply placeholder')}>Apply Leave</Button></div>
        <div>
          {leaves.map(l=> (
            <div key={l._id} className="p-3 border rounded mb-2">
              <div className="font-bold">{l.staff?.name || l.staff}</div>
              <div className="text-xs text-slate-500">{l.fromDate} - {l.toDate} ({l.status})</div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  )
}
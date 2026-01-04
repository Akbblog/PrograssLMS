"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function PayrollPage(){
  const [items, setItems] = useState<any[]>([])
  useEffect(()=>{ fetch('/api/v1/hr/payroll').then(r=>r.json()).then(d=>setItems(d.data||[])).catch(()=>{}) },[])
  return (
    <AdminPageLayout title="Payroll" description="Generate and process payroll">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4"><Button onClick={()=>alert('Generate placeholder')}>Generate Payroll</Button></div>
        <div>
          {items.map(i=> (
            <div key={i._id} className="p-3 border rounded mb-2">
              <div className="font-bold">{i.staff?.name || i.staff} - {i.month}/{i.year}</div>
              <div className="text-xs text-slate-500">Status: {i.status}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminPageLayout>
  )
}
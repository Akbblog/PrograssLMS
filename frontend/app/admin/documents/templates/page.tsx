"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function TemplatesPage(){
  const [templates, setTemplates] = useState<any[]>([])
  useEffect(()=>{ fetch('/api/v1/documents/templates').then(r=>r.json()).then(d=>setTemplates(d.data||[])).catch(()=>{}) },[])
  return (
    <AdminPageLayout title="Templates" description="Manage document templates">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4"><Button>Create Template</Button></div>
        {templates.map(t=> (
          <div key={t._id} className="p-3 border rounded mb-2">
            <div className="font-bold">{t.templateName} ({t.templateType})</div>
          </div>
        ))}
      </div>
    </AdminPageLayout>
  )
}
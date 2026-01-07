"use client"

import React, { useMemo } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'
import { useDocumentTemplates, useCreateDocumentTemplate, useDeleteDocumentTemplate } from '@/hooks/useDocumentTemplates'

export default function TemplatesPage(){
  const { data: templates = [], isLoading } = useDocumentTemplates()
  const createTemplate = useCreateDocumentTemplate()
  const deleteTemplate = useDeleteDocumentTemplate()

  const handleCreate = async () => {
    const name = prompt('Template name')
    if (!name) return
    try {
      await createTemplate.mutateAsync({ templateName: name, templateType: 'generic' })
      alert('Template created')
    } catch (e) {
      console.error(e)
      alert('Failed to create template')
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Delete this template?')) return
    try {
      await deleteTemplate.mutateAsync(id)
      alert('Deleted')
    } catch (e) {
      console.error(e)
      alert('Failed to delete')
    }
  }

  const items = useMemo(() => (Array.isArray(templates) ? templates : []), [templates])

  return (
    <AdminPageLayout title="Templates" description="Manage document templates">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-2 mb-4"><Button onClick={handleCreate}>Create Template</Button></div>
        {isLoading ? (
          <div>Loading templates…</div>
        ) : (
          items.map((t: any) => (
            <div key={t._id || t.id} className="p-3 border rounded mb-2 flex items-center justify-between">
              <div className="font-bold">{t.templateName} ({t.templateType})</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => alert('Edit flow not implemented')}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(t._id || t.id)}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminPageLayout>
  )
}
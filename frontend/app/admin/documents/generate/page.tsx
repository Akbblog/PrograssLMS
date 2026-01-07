"use client"

import React, { useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function GeneratePage(){
  const [pdfLib, setPdfLib] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const loadPdfLib = async () => {
    setLoading(true)
    try {
      const mod = await import('@react-pdf/renderer')
      // It's okay to keep the whole module; we only render on client after this
      setPdfLib(mod)
    } catch (e) {
      console.error('Failed to load PDF library', e)
      alert('Failed to load PDF library')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPageLayout title="Generate Document" description="Create and preview documents">
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <p className="text-sm text-slate-500">Select a document type and target entity to generate a PDF. (Placeholder UI)</p>

        {!pdfLib ? (
          <div className="flex gap-2">
            <Button onClick={loadPdfLib} disabled={loading}>{loading ? 'Loading...' : 'Load PDF Tools'}</Button>
            <Button variant="outline" onClick={() => alert('Server-side generation not implemented')}>Server Generate (placeholder)</Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-500">PDF renderer loaded. Use the download link to get a sample PDF.</p>
            {/* Render a simple Download link using the dynamically imported components */}
            {
              React.createElement(pdfLib.PDFDownloadLink, {
                document: React.createElement(pdfLib.Document, null,
                  React.createElement(pdfLib.Page, { size: "A4" },
                    React.createElement(pdfLib.Text, null, "Sample document from dynamic import")
                  )
                ),
                fileName: 'sample.pdf',
                children: ({ loading }: any) => loading ? 'Preparing PDF...' : 'Download sample PDF'
              })
            }
          </div>
        )}

      </div>
    </AdminPageLayout>
  )
}
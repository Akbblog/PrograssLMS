"use client"

import React, { useEffect, useRef, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'

export default function ScannerPage() {
  const [scanned, setScanned] = useState(null)
  const [manualData, setManualData] = useState('')

  const handleManualScan = async () => {
    try {
      const res = await fetch('/api/v1/attendance/qr/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qrData: manualData }) })
      const data = await res.json()
      setScanned(data)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AdminPageLayout title="QR Scanner" description="Scan student QR codes to record attendance">
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <p className="text-sm text-slate-500">This page is a placeholder scanner. Integrate <code>html5-qrcode</code> for camera scanning.</p>

        <div className="space-y-2">
          <label className="text-sm font-medium">Simulate QR Payload (encrypted)</label>
          <input className="w-full border rounded p-2" value={manualData} onChange={(e)=>setManualData(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={handleManualScan}>Send Scan</Button>
          </div>
        </div>

        {scanned && <pre className="bg-slate-50 p-4 rounded">{JSON.stringify(scanned, null, 2)}</pre>}
      </div>
    </AdminPageLayout>
  )
}

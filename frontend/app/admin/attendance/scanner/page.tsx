"use client"

import React, { useEffect, useRef, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Button } from '@/components/ui/button'
import api from '@/lib/api/endpoints'

export default function ScannerPage() {
  const [scanned, setScanned] = useState(null)
  const [manualData, setManualData] = useState('')

  const handleManualScan = async () => {
    try {
      const data = await api.post('/attendance/qr/scan', { qrData: manualData })
      setScanned(data)
    } catch (e) {
      console.error(e)
    }
  }

  const [html5Loaded, setHtml5Loaded] = useState(false);
  const startCameraScan = async () => {
    try {
      const m = await import('html5-qrcode');
      console.log('html5-qrcode loaded', m);
      setHtml5Loaded(true);
      // Integration point: initialize scanner on a dedicated DOM node and start camera
    } catch (err) {
      console.error('Failed to load html5-qrcode', err);
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
            <Button onClick={startCameraScan} variant="outline">{html5Loaded ? 'Camera Ready' : 'Start Camera Scan'}</Button>
          </div>
        </div>

        {scanned && <pre className="bg-slate-50 p-4 rounded">{JSON.stringify(scanned, null, 2)}</pre>}
      </div>
    </AdminPageLayout>
  )
}

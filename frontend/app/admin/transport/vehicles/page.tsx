"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/v1/transport/vehicles')
      .then(r => r.json())
      .then(d => setVehicles(d.data || []))
      .catch(() => {})
  }, [])

  return (
    <AdminPageLayout title="Vehicles" description="Fleet management">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Button>Add Vehicle</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map(v => (
              <TableRow key={v._id}>
                <TableCell className="font-bold">{v.vehicleNumber}</TableCell>
                <TableCell>{v.vehicleType}</TableCell>
                <TableCell>{v.capacity}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminPageLayout>
  )
}

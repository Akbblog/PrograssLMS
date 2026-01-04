"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/v1/transport/allocations')
      .then(r => r.json())
      .then(d => setAllocations(d.data || []))
      .catch(() => {})
  }, [])

  return (
    <AdminPageLayout title="Allocations" description="Student transport allocations">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Button>Allocate Student</Button>
          <Button variant="outline">Bulk Allocate</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Stop</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map(a => (
              <TableRow key={a._id}>
                <TableCell className="font-bold">{a.student?.name || a.student}</TableCell>
                <TableCell>{a.route?.routeName || a.route}</TableCell>
                <TableCell>{a.stop}</TableCell>
                <TableCell>{a.monthlyFee}</TableCell>
                <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminPageLayout>
  )
}

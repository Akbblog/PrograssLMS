"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { unwrapArray } from '@/lib/utils'

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/v1/transport/routes')
      .then(r => r.json())
      .then(d => setRoutes(unwrapArray(d, 'routes')))
      .catch(() => {})
  }, [])

  return (
    <AdminPageLayout title="Routes" description="Manage routes and stops">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Button>Add Route</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map(r => (
              <TableRow key={r._id}>
                <TableCell className="font-bold">{r.routeName}</TableCell>
                <TableCell>{r.routeCode}</TableCell>
                <TableCell>{r.stops?.length || 0}</TableCell>
                <TableCell>{r.monthlyFee}</TableCell>
                <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminPageLayout>
  )
}

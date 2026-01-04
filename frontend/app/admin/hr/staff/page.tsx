"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function StaffPage(){
  const [staff, setStaff] = useState<any[]>([])
  useEffect(()=>{ fetch('/api/v1/hr/staff').then(r=>r.json()).then(d=>setStaff(d.data||[])).catch(()=>{}) },[])
  return (
    <AdminPageLayout title="Staff Directory" description="Manage staff profiles">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Button>Add Staff</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map(s=> (
              <TableRow key={s._id}>
                <TableCell className="font-bold">{s.user?.name || s.user}</TableCell>
                <TableCell>{s.employeeId}</TableCell>
                <TableCell>{s.designation}</TableCell>
                <TableCell>{s.status}</TableCell>
                <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminPageLayout>
  )
}
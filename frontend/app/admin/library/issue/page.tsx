"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function IssuePage() {
  const [query, setQuery] = useState('')
  const [bookId, setBookId] = useState('')
  const [borrowerId, setBorrowerId] = useState('')
  const [borrowerType, setBorrowerType] = useState('Student')

  const searchBooks = () => {
    // Placeholder for autocomplete
    alert('Search is placeholder')
  }

  const handleIssue = () => {
    fetch('/api/v1/library/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, borrowerId, borrowerType, dueDate: new Date(Date.now() + 14*24*3600*1000) })
    }).then(r => r.json()).then(d => alert('Issued'))
  }

  return (
    <AdminPageLayout title="Issue / Return" description="Issue books to students and teachers">
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <div>
          <label className="text-sm font-medium">Book ID</label>
          <Input value={bookId} onChange={(e) => setBookId(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Borrower ID</label>
          <Input value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleIssue}>Issue Book</Button>
          <Button variant="outline">Return Book</Button>
        </div>
      </div>
    </AdminPageLayout>
  )
}

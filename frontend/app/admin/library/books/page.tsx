"use client"

import React, { useEffect, useState } from 'react'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([])
  const [q, setQ] = useState('')

  const fetchBooks = () => {
    fetch('/api/v1/library/books')
      .then(r => r.json())
      .then(data => setBooks(data.data || []))
      .catch(() => {})
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <AdminPageLayout title="Books" description="Catalog of library books">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Input placeholder="Search by title, author or ISBN" value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={() => fetchBooks()}>Search</Button>
          <Button className="ml-auto">Add Book</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map(b => (
              <TableRow key={b._id}>
                <TableCell className="font-bold">{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>{b.availableQuantity}</TableCell>
                <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminPageLayout>
  )
}

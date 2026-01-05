"use client";

import React, { useEffect, useState } from "react";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import BookList from "./_components/BookList";
import BookForm from "./_components/BookForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/v1/library/books");
      const data = await res.json();
      // Adjust depending on how API wrapper works
      if (data.status === 'success' || Array.isArray(data)) {
          setBooks(unwrapArray(data.data || data, 'books'));
      }
    } catch (error) {
      toast.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = {
          ...data,
          // Format date for API if needed
          acquisitionInfo: {
              ...data.acquisitionInfo,
          }
      };

      const res = await fetch("/api/v1/library/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Book added successfully");
        setIsAddOpen(false);
        fetchBooks();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to add book");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBook = (book: any) => {
      // Transform author array if needed (string vs array)
      const formatted = {
          ...book,
          acquisitionInfo: {
              ...book.acquisitionInfo,
              dateReceived: book.acquisitionInfo?.dateReceived ? new Date(book.acquisitionInfo.dateReceived).toISOString().split('T')[0] : ''
          }
      };
      setEditingBook(formatted);
      setIsAddOpen(true);
  };
  
  const handleDeleteBook = async (id: string) => {
      if(!confirm("Are you sure?")) return;
      // Implementation
      toast.success("Book deleted placeholder");
  }

  return (
    <AdminPageLayout title="Books Catalog" description="Manage library books inventory">
      <div className="p-6">
        <BookList 
            data={books} 
            onAdd={() => { setEditingBook(null); setIsAddOpen(true); }}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onView={(b) => console.log('View', b)}
        />

        <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
            <SheetContent side="right" className="w-[100%] sm:w-[800px] sm:max-w-[90vw] p-0 overflow-hidden">
                <SheetHeader className="px-6 py-4 border-b">
                     <SheetTitle>{editingBook ? "Edit Book Details" : "Add New Book"}</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 py-6">
                    <BookForm 
                        onSubmit={handleAddBook} 
                        onCancel={() => setIsAddOpen(false)} 
                        isLoading={isLoading}
                        defaultValues={editingBook}
                    />
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </AdminPageLayout>
  );
}


"use client";

import React, { useEffect, useState } from "react";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import BookList from "./_components/BookList";
import BookForm from "./_components/BookForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
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
            <SheetContent side="right" className="w-[100%] sm:w-[920px] sm:max-w-[95vw] p-0 overflow-hidden">
                <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Button asChild variant="ghost" size="sm" className="-ml-2">
                                <a onClick={() => setIsAddOpen(false)}>
                                    <ArrowLeft className="h-4 w-4 text-slate-600" />
                                </a>
                            </Button>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{editingBook ? "Edit Book Details" : "Add New Book"}</h2>
                                <p className="text-sm text-slate-500">Enter book metadata, inventory and acquisition details</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[calc(100vh-200px)] overflow-y-auto px-0 py-0">
                        <BookForm 
                            onSubmit={handleAddBook} 
                            onCancel={() => setIsAddOpen(false)} 
                            isLoading={isLoading}
                            defaultValues={editingBook}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </AdminPageLayout>
  );
}


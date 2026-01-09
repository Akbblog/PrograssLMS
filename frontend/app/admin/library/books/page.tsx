"use client";

import React, { useEffect, useState } from "react";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import BookList from "./_components/BookList";
import BookForm from "./_components/BookForm";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";
import { useBooks, useCreateBook } from '@/hooks/useBooks';

export default function BooksPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: booksRes, isLoading: booksLoading } = useBooks();
  const books = (booksRes && (booksRes as any).data) ? (booksRes as any).data : (booksRes || []);

  const { mutateAsync: createBook } = useCreateBook();

  const handleAddBook = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = {
          ...data,
          acquisitionInfo: {
              ...data.acquisitionInfo,
          }
      };

      await createBook(payload);
      toast.success("Book added successfully");
      setIsAddOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to add book");
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
            <SheetContent side="right" className="w-[100%] sm:w-[920px] sm:max-w-[95vw] p-0 overflow-hidden gap-0">
                <SheetHeader className="px-6 py-5 border-b">
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="ghost" size="sm" className="-ml-2" onClick={() => setIsAddOpen(false)}>
                            <ArrowLeft className="h-4 w-4 text-slate-600" />
                        </Button>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <SheetTitle>{editingBook ? "Edit Book Details" : "Add New Book"}</SheetTitle>
                            <SheetDescription>Enter book metadata, inventory and acquisition details</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>
                <SheetBody className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto w-full">
                        <BookForm 
                            onSubmit={handleAddBook} 
                            onCancel={() => setIsAddOpen(false)} 
                            isLoading={isLoading}
                            defaultValues={editingBook}
                        />
                    </div>
                </SheetBody>
            </SheetContent>
        </Sheet>
      </div>
    </AdminPageLayout>
  );
}


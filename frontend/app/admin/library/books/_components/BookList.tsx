"use client";

import React, { useState } from "react";
import { unwrapArray } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    LayoutGrid, 
    List, 
    Plus, 
    Search, 
    MoreHorizontal, 
    Eye, 
    Pencil, 
    Trash2, 
    Barcode, 
    FileDown,
    BookOpen
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  isbn?: string;
  category: string;
  coverImage?: string;
  totalCopies: number;
  availableCopies: number;
  location?: { shelf: string; row: string };
  status: string;
}

interface BookListProps {
  data: Book[];
  onAdd: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
}

export default function BookList({ data, onAdd, onEdit, onDelete, onView }: BookListProps) {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

    const safeData = unwrapArray<Book>(data);

    const filteredData = safeData.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      book.isbn?.includes(searchTerm);

    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'available': return 'bg-green-100 text-green-700';
          case 'low_stock': return 'bg-yellow-100 text-yellow-700';
          case 'out_of_stock': return 'bg-red-100 text-red-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

    const uniqueCategories = Array.from(new Set(safeData.map(b => b.category).filter(Boolean)));

  return (
    <div className="space-y-6">
       {/* Stats Section */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">Total Books</div>
            <div className="text-2xl font-bold">{safeData.length}</div>
        </Card>
        <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">Available</div>
            <div className="text-2xl font-bold text-green-600">
                {safeData.reduce((acc, curr) => acc + (curr.availableCopies || 0), 0)}
            </div>
        </Card>
        <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">Issued</div>
            <div className="text-2xl font-bold text-blue-600">
                {safeData.reduce((acc, curr) => acc + ((curr.totalCopies || 0) - (curr.availableCopies || 0)), 0)}
            </div>
        </Card>
         <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">Low Stock</div>
            <div className="text-2xl font-bold text-yellow-600">
                {safeData.filter(b => b.status === 'low_stock').length}
            </div>
        </Card>
      </div>

       {/* Toolbar */}
       <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search by title, author, ISBN..."
                className="pl-8 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
            </Select>
         </div>

         <div className="flex items-center gap-2">
            <div className="border rounded-md flex p-1 bg-muted/20">
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('table')}>
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <Button variant="outline" className="h-10 gap-2">
                <Barcode className="h-4 w-4" /> Print Barcodes
            </Button>
            <Button className="h-10 gap-2 bg-primary hover:bg-primary/90" onClick={onAdd}>
                <Plus className="h-4 w-4" /> Add Book
            </Button>
        </div>
       </div>

       {/* Content */}
       {viewMode === 'table' ? (
           <div className="rounded-md border bg-white">
               <Table>
                   <TableHeader className="bg-gray-50 uppercase text-xs">
                       <TableRow>
                           <TableHead className="w-[60px]">Cover</TableHead>
                           <TableHead>ISBN</TableHead>
                           <TableHead className="w-[30%]">Title</TableHead>
                           <TableHead>Author</TableHead>
                           <TableHead>Category</TableHead>
                           <TableHead>Location</TableHead>
                           <TableHead>Available</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                       </TableRow>
                   </TableHeader>
                   <TableBody>
                       {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">No books found matching criteria.</TableCell>
                            </TableRow>
                       ) : (
                           filteredData.map(book => (
                               <TableRow key={book._id} className="h-[60px]">
                                   <TableCell>
                                       <div className="h-10 w-8 bg-gray-200 rounded overflow-hidden">
                                           {book.coverImage ? (
                                               <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                                           ) : (
                                               <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                   <BookOpen className="h-4 w-4" />
                                               </div>
                                           )}
                                       </div>
                                   </TableCell>
                                   <TableCell className="font-mono text-xs">{book.isbn || 'N/A'}</TableCell>
                                   <TableCell>
                                       <div className="font-medium line-clamp-1" title={book.title}>{book.title}</div>
                                       {book.subtitle && <div className="text-xs text-muted-foreground line-clamp-1">{book.subtitle}</div>}
                                   </TableCell>
                                   <TableCell className="text-sm">{book.authors?.join(', ')}</TableCell>
                                   <TableCell>{book.category}</TableCell>
                                   <TableCell className="text-xs text-muted-foreground">
                                       {book.location ? `S:${book.location.shelf} R:${book.location.row}` : '-'}
                                   </TableCell>
                                   <TableCell>
                                       <Badge variant={book.availableCopies > 0 ? "outline" : "destructive"} className={getStatusColor(book.status)}>
                                           {book.availableCopies} / {book.totalCopies}
                                       </Badge>
                                   </TableCell>
                                   <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(book)}>
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(book)}>
                                                <Pencil className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                      <DropdownMenuItem onClick={() => {}}>Issue Book</DropdownMenuItem>
                                                      <DropdownMenuItem onClick={() => {}}>Print Barcode</DropdownMenuItem>
                                                      <DropdownMenuSeparator />
                                                      <DropdownMenuItem onClick={() => onDelete(book._id)} className="text-red-600">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                   </TableCell>
                               </TableRow>
                           ))
                       )}
                   </TableBody>
               </Table>
           </div>
       ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
               {filteredData.map(book => (
                   <Card key={book._id} className="overflow-hidden hover:shadow-md transition-shadow group">
                       <div className="aspect-[2/3] w-full bg-gray-100 relative">
                           {book.coverImage ? (
                               <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                           ) : (
                               <div className="h-full w-full flex items-center justify-center flex-col text-gray-400">
                                   <BookOpen className="h-12 w-12 mb-2" />
                                   <span className="text-xs">No Cover</span>
                               </div>
                           )}
                           <div className="absolute top-2 right-2">
                               <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                           </div>
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="icon" variant="secondary" onClick={() => onView(book)}><Eye className="h-4 w-4" /></Button>
                                <Button size="icon" variant="secondary" onClick={() => onEdit(book)}><Pencil className="h-4 w-4" /></Button>
                           </div>
                       </div>
                       <CardContent className="p-3">
                           <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1" title={book.title}>{book.title}</h3>
                           <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{book.authors?.join(', ')}</p>
                           <div className="flex justify-between items-center text-xs">
                               <span className="font-mono text-gray-500">{book.location?.shelf ? `Shelf ${book.location.shelf}` : ''}</span>
                               <span className="font-medium">{book.availableCopies} available</span>
                           </div>
                       </CardContent>
                   </Card>
               ))}
           </div>
       )}
    </div>
  );
}

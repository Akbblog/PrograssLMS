"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  isbn: z.string().optional(),
  authors: z.array(z.string().min(1)).min(1, "At least one author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  publishedYear: z.coerce.number().min(1000).max(new Date().getFullYear()+1),
  edition: z.string().optional(),
  language: z.string().default("English"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  
  totalCopies: z.coerce.number().min(1),
  availableCopies: z.coerce.number().min(0),
  location: z.object({
      shelf: z.string().min(1, "Shelf required"),
      row: z.string().min(1, "Row required")
  }),

  acquisitionInfo: z.object({
      dateReceived: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid Date"),
      source: z.enum(['purchased', 'donated', 'sponsored']),
      vendor: z.string().optional(),
      price: z.coerce.number().optional()
  })
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (data: BookFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BookForm({ defaultValues, onSubmit, onCancel, isLoading }: BookFormProps) {
  const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors }
  } = useForm<BookFormValues>({
      resolver: zodResolver(bookSchema),
      defaultValues: defaultValues || {
          authors: [""],
          language: "English",
          totalCopies: 1,
          availableCopies: 1,
          acquisitionInfo: { source: 'purchased' }
      }
  });

  const { fields: authorFields, append: appendAuthor, remove: removeAuthor } = useFieldArray({
      control,
      name: "authors" as any // Type assertion for simple array of strings
  });

  // Auto-sync available with total if creating new
  const totalCopies = watch("totalCopies");
  React.useEffect(() => {
      if (!defaultValues) {
          setValue("availableCopies", totalCopies);
      }
  }, [totalCopies, setValue, defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
        
        {/* Section 1: Basic Info */}
        <Card>
            <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>ISBN</Label>
                         <div className="flex gap-2">
                             <Input {...register("isbn")} placeholder="978-..." />
                             <Button type="button" variant="outline">Lookup</Button>
                         </div>
                     </div>
                     <div className="space-y-2">
                         <Label>Language <span className="text-red-500">*</span></Label>
                         <Input {...register("language")} />
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Title <span className="text-red-500">*</span></Label>
                         <Input {...register("title")} className={errors.title && "border-red-500"} />
                         {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Subtitle</Label>
                         <Input {...register("subtitle")} />
                     </div>
                 </div>

                 <div className="space-y-2">
                     <Label>Authors <span className="text-red-500">*</span></Label>
                     {authorFields.map((field, index) => (
                         <div key={field.id} className="flex gap-2">
                             <Input {...register(`authors.${index}` as any)} placeholder="Author Name" />
                             <Button type="button" variant="ghost" size="icon" onClick={() => removeAuthor(index)} disabled={authorFields.length === 1}>
                                 <Trash2 className="h-4 w-4" />
                             </Button>
                         </div>
                     ))}
                     <Button type="button" variant="link" size="sm" className="px-0" onClick={() => appendAuthor("")}>
                         + Add Another Author
                     </Button>
                     {errors.authors && <span className="text-xs text-red-500">{errors.authors.message}</span>}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                         <Label>Publisher <span className="text-red-500">*</span></Label>
                         <Input {...register("publisher")} />
                         {errors.publisher && <span className="text-xs text-red-500">{errors.publisher.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Published Year</Label>
                         <Input type="number" {...register("publishedYear")} />
                     </div>
                     <div className="space-y-2">
                         <Label>Edition</Label>
                         <Input {...register("edition")} />
                     </div>
                 </div>
                 
                 <div className="space-y-2">
                     <Label>Description</Label>
                     <Textarea {...register("description")} rows={3} />
                 </div>
            </CardContent>
        </Card>

        {/* Section 2: Classification */}
        <Card>
            <CardHeader><CardTitle className="text-lg">Classification</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Category <span className="text-red-500">*</span></Label>
                         <Input {...register("category")} placeholder="e.g. Science, Fiction" />
                         {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Subcategory</Label>
                         <Input {...register("subcategory")} />
                     </div>
                 </div>
            </CardContent>
        </Card>

        {/* Section 3: Inventory */}
        <Card>
            <CardHeader><CardTitle className="text-lg">Inventory & Location</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Total Copies <span className="text-red-500">*</span></Label>
                         <Input type="number" {...register("totalCopies")} />
                     </div>
                     <div className="space-y-2">
                         <Label>Available Copies</Label>
                         <Input type="number" {...register("availableCopies")} />
                     </div>
                 </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Shelf Location <span className="text-red-500">*</span></Label>
                         <Input {...register("location.shelf")} />
                         {errors.location?.shelf && <span className="text-xs text-red-500">{errors.location.shelf.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Row Number <span className="text-red-500">*</span></Label>
                         <Input {...register("location.row")} />
                         {errors.location?.row && <span className="text-xs text-red-500">{errors.location.row.message}</span>}
                     </div>
                 </div>
            </CardContent>
        </Card>

        {/* Section 4: Acquisition */}
        <Card>
            <CardHeader><CardTitle className="text-lg">Acquisition Details</CardTitle></CardHeader>
            <CardContent className="grid gap-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                         <Label>Date Received</Label>
                         <Input type="date" {...register("acquisitionInfo.dateReceived")} />
                     </div>
                     <div className="space-y-2">
                         <Label>Source</Label>
                         <Controller
                            control={control}
                            name="acquisitionInfo.source"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="purchased">Purchased</SelectItem>
                                        <SelectItem value="donated">Donated</SelectItem>
                                        <SelectItem value="sponsored">Sponsored</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                         />
                     </div>
                     <div className="space-y-2">
                         <Label>Vendor</Label>
                         <Input {...register("acquisitionInfo.vendor")} />
                     </div>
                 </div>
                 <div className="space-y-2">
                     <Label>Price</Label>
                     <Input type="number" {...register("acquisitionInfo.price")} />
                 </div>
            </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white p-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save Book"}</Button>
        </div>
    </form>
  );
}

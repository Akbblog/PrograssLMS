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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, BookOpen, Tag, Loader2 } from "lucide-react";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  isbn: z.string().optional(),
  authors: z.array(z.object({ name: z.string().min(1) })).min(1, "At least one author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  publishedYear: z.number().min(1000).max(2100).optional(),
  edition: z.string().optional(),
  language: z.string().default("English"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  
  totalCopies: z.number().min(1),
  availableCopies: z.number().min(0).optional(),
  location: z.object({
      shelf: z.string().min(1, "Shelf required"),
      row: z.string().min(1, "Row required")
  }),

  acquisitionInfo: z.object({
      dateReceived: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid Date"),
      source: z.enum(['purchased', 'donated', 'sponsored']),
      vendor: z.string().optional(),
      price: z.number().optional()
  })
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (data: any) => void; // Change to any for now
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BookForm({ defaultValues, onSubmit, onCancel, isLoading }: BookFormProps) {
  // Transform defaultValues if authors are strings
  const transformedDefaults = defaultValues ? {
      ...defaultValues,
      authors: Array.isArray(defaultValues.authors) && defaultValues.authors.length > 0 && typeof (defaultValues.authors[0] as any) === 'string'
          ? (defaultValues.authors as unknown as string[]).map((name: string) => ({ name }))
          : defaultValues.authors || [{ name: "" }]
  } : undefined;
  const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors }
  } = useForm<BookFormValues>({
      // resolver: zodResolver(bookSchema),
      defaultValues: transformedDefaults || {
          authors: [{ name: "" }],
          language: "English",
          totalCopies: 1,
          availableCopies: 1,
          acquisitionInfo: { source: 'purchased' }
      }
  });

  const { fields: authorFields, append: appendAuthor, remove: removeAuthor } = useFieldArray({
      control,
      name: "authors"
  });

  // Auto-sync available with total if creating new
  const totalCopies = watch("totalCopies");
  React.useEffect(() => {
      if (!defaultValues) {
          setValue("availableCopies", totalCopies);
      }
  }, [totalCopies, setValue, defaultValues]);

  const onFormSubmit = (data: BookFormValues) => {
      // Transform authors from array of objects to array of strings
      const transformedData = {
          ...data,
          authors: data.authors.map(a => a.name)
      };
      onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 pb-10">
        
        {/* Section 1: Basic Info */}
        <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Core metadata for the book</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>ISBN</Label>
                         <div className="flex gap-2">
                             <Input {...register("isbn")} placeholder="978-..." className="h-10" />
                             <Button type="button" variant="outline" className="h-10">Lookup</Button>
                         </div>
                     </div>
                     <div className="space-y-2">
                         <Label>Language <span className="text-destructive">*</span></Label>
                         <Input {...register("language")} className="h-10" />
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Title <span className="text-destructive">*</span></Label>
                         <Input {...register("title")} className={errors.title && "border-destructive"} />
                         {errors.title && <span className="text-xs text-destructive">{errors.title.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Subtitle</Label>
                         <Input {...register("subtitle")} />
                     </div>
                 </div>

                 <div className="space-y-2">
                     <Label>Authors <span className="text-destructive">*</span></Label>
                     {authorFields.map((field, index) => (
                         <div key={field.id} className="flex gap-2">
                             <Input {...register(`authors.${index}.name`)} placeholder="Author Name" />
                             <Button type="button" variant="ghost" size="icon" onClick={() => removeAuthor(index)} disabled={authorFields.length === 1}>
                                 <Trash2 className="h-4 w-4" />
                             </Button>
                         </div>
                     ))}
                     <Button type="button" variant="link" size="sm" className="px-0" onClick={() => appendAuthor({ name: "" })}>
                         + Add Another Author
                     </Button>
                     {errors.authors && <span className="text-xs text-destructive">{errors.authors.message}</span>}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                         <Label>Publisher <span className="text-destructive">*</span></Label>
                         <Input {...register("publisher")} />
                         {errors.publisher && <span className="text-xs text-destructive">{errors.publisher.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Published Year</Label>
                         <Input type="number" {...register("publishedYear", { valueAsNumber: true })} />
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
        <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <CardTitle>Classification</CardTitle>
                        <CardDescription>Categorize the book for easier discovery</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Category <span className="text-destructive">*</span></Label>
                         <Input {...register("category")} placeholder="e.g. Science, Fiction" className="h-10" />
                         {errors.category && <span className="text-xs text-destructive">{errors.category.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Subcategory</Label>
                         <Input {...register("subcategory")} className="h-10" />
                     </div>
                 </div>
            </CardContent>
        </Card>

        {/* Section 3: Inventory */}
        <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <CardTitle>Inventory & Location</CardTitle>
                        <CardDescription>Track copies and shelving information</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Total Copies <span className="text-destructive">*</span></Label>
                         <Input type="number" {...register("totalCopies", { valueAsNumber: true })} className="h-10" />
                     </div>
                     <div className="space-y-2">
                         <Label>Available Copies</Label>
                         <Input type="number" {...register("availableCopies", { valueAsNumber: true })} className="h-10" />
                     </div>
                 </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label>Shelf Location <span className="text-destructive">*</span></Label>
                         <Input {...register("location.shelf")} className="h-10" />
                         {errors.location?.shelf && <span className="text-xs text-destructive">{errors.location.shelf.message}</span>}
                     </div>
                     <div className="space-y-2">
                         <Label>Row Number <span className="text-destructive">*</span></Label>
                         <Input {...register("location.row")} className="h-10" />
                         {errors.location?.row && <span className="text-xs text-destructive">{errors.location.row.message}</span>}
                     </div>
                 </div>
            </CardContent>
        </Card>

        {/* Section 4: Acquisition */}
        <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <CardTitle>Acquisition Details</CardTitle>
                        <CardDescription>How the book was acquired and cost details</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                         <Label>Date Received</Label>
                         <Input type="date" {...register("acquisitionInfo.dateReceived")} className="h-10" />
                     </div>
                     <div className="space-y-2">
                         <Label>Source</Label>
                         <Controller
                            control={control}
                            name="acquisitionInfo.source"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
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
                         <Input {...register("acquisitionInfo.vendor")} className="h-10" />
                     </div>
                 </div>
                 <div className="space-y-2">
                     <Label>Price</Label>
                     <Input type="number" {...register("acquisitionInfo.price", { valueAsNumber: true })} className="h-10" />
                 </div>
            </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white p-4 border-t z-10">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                {isLoading ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : 'Save Book'}
            </Button>
        </div>
    </form>
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/api/client"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Student name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    studentId: z.string().min(1, "Student ID is required"),
    classLevel: z.string().min(1, "Class level is required"),
    academicYear: z.string().min(1, "Academic year is required"),
})

export default function CreateStudentPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            studentId: "",
            classLevel: "",
            academicYear: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            // In a real app:
            // await apiClient.post("/students/admin/register", values)

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success("Student registered successfully!")
            router.push("/school-admin/students")
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to register student.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Link href="/school-admin/students">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Register Student</h1>
                    <p className="text-muted-foreground">Add a new student to the school database.</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                            <CardDescription>Enter the student's personal and academic details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="student@school.edu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Default password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student ID / Roll Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="STU-2024-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="classLevel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class / Grade</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="grade-1">Grade 1</SelectItem>
                                                    <SelectItem value="grade-2">Grade 2</SelectItem>
                                                    <SelectItem value="grade-3">Grade 3</SelectItem>
                                                    <SelectItem value="grade-4">Grade 4</SelectItem>
                                                    <SelectItem value="grade-5">Grade 5</SelectItem>
                                                    <SelectItem value="grade-6">Grade 6</SelectItem>
                                                    <SelectItem value="grade-7">Grade 7</SelectItem>
                                                    <SelectItem value="grade-8">Grade 8</SelectItem>
                                                    <SelectItem value="grade-9">Grade 9</SelectItem>
                                                    <SelectItem value="grade-10">Grade 10</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="academicYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Year</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                                                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href="/school-admin/students">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register Student
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { superAdminAPI } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "School name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    address: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        country: z.string().min(1, "Country is required"),
        zipCode: z.string().min(1, "Zip code is required"),
    }),
    adminName: z.string().min(2, "Admin name is required"),
    adminEmail: z.string().email("Invalid admin email address"),
    adminPassword: z.string().min(6, "Password must be at least 6 characters"),
    plan: z.enum(["trial", "basic", "standard", "premium"]),
});

export default function CreateSchoolPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [createdResult, setCreatedResult] = useState<null | { school: any; admin: any; password?: string }>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
            },
            adminName: "",
            adminEmail: "",
            adminPassword: "",
            plan: "trial",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res: any = await superAdminAPI.createSchool(values);
            // API returns { status: "success", data: { school, admin } }
            setCreatedResult({ school: res.data.school, admin: res.data.admin, password: values.adminPassword });
            toast.success("School created successfully. Admin credentials shown below.");
            // keep on this page so the superadmin can copy the admin credentials
        } catch (error: any) {
            console.error("Failed to create school:", error);
            toast.error(error.message || "Failed to create school");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Schools
            </Button>

            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Create New School</h1>
                <p className="text-muted-foreground">
                    Register a new school and assign an initial administrator.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>School Details</CardTitle>
                            <CardDescription>
                                Basic information about the school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>School Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Progress Demo School" {...field} />
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
                                            <FormLabel>School Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="contact@school.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+1 234 567 890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                            <CardDescription>
                                Physical location of the school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="address.street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Education Lane" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="address.city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="New York" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State/Province</FormLabel>
                                            <FormControl>
                                                <Input placeholder="NY" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="address.country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input placeholder="USA" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zip/Postal Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="10001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Initial Administrator</CardTitle>
                            <CardDescription>
                                Create the first admin account for this school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="adminName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Name</FormLabel>
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
                                    name="adminEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Admin Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="admin@school.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="adminPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Plan</CardTitle>
                            <CardDescription>
                                Select the subscription plan for this school.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="plan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Plan</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a plan" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="trial">Trial (14 Days)</SelectItem>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="standard">Standard</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Plans determine feature availability and usage limits.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create School
                        </Button>
                    </div>
                </form>
            </Form>
            {createdResult && (
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>School Created</CardTitle>
                            <CardDescription>This school and its initial admin were created successfully.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>School:</strong> {createdResult.school?.name} (ID: {createdResult.school?._id})</p>
                                <p><strong>Admin Name:</strong> {createdResult.admin?.name}</p>
                                <p><strong>Admin Email:</strong> {createdResult.admin?.email}</p>
                                <p><strong>Admin Password:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{createdResult.password}</code></p>
                                <p className="text-sm text-gray-600">Record the password now — the admin can change it after first login.</p>
                                <div className="pt-4 flex gap-2">
                                    <Button onClick={() => router.push('/superadmin/dashboard')}>Go to Dashboard</Button>
                                    <Button variant="outline" onClick={() => setCreatedResult(null)}>Create Another</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

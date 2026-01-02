"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Loader2,
    Eye,
    EyeOff,
    GraduationCap,
    Users,
    Shield,
    Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import apiClient from "@/lib/api/client"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

type FormValues = z.infer<typeof formSchema>

type RoleType = 'student' | 'teacher' | 'admin' | 'super_admin';

interface RoleConfig {
    id: RoleType;
    label: string;
    icon: any;
    endpoint: string;
}

const roleConfigs: RoleConfig[] = [
    {
        id: 'student',
        label: 'Student',
        icon: GraduationCap,
        endpoint: '/students/login'
    },
    {
        id: 'teacher',
        label: 'Teacher',
        icon: Users,
        endpoint: '/teachers/login'
    },
    {
        id: 'admin',
        label: 'Administrator',
        icon: Shield,
        endpoint: '/admin/login'
    },
    {
        id: 'super_admin',
        label: 'Super Admin',
        icon: Sparkles,
        endpoint: '/superadmin/login'
    }
]

export default function LoginPage() {
    const router = useRouter()
    const login = useAuthStore((state) => state.login)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [selectedRole, setSelectedRole] = useState<RoleType>('student')
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Unified Login Logic
    async function onSubmit(values: FormValues) {
        setIsLoading(true)

        // Define sequence of roles to attempt
        const attempts: RoleConfig[] = [
            roleConfigs.find(r => r.id === 'student')!,
            roleConfigs.find(r => r.id === 'teacher')!,
            roleConfigs.find(r => r.id === 'admin')!,
            roleConfigs.find(r => r.id === 'super_admin')!
        ];

        let success = false;

        for (const roleConfig of attempts) {
            try {
                // console.log(`Attempting login as ${roleConfig.label}...`); 
                const res = await apiClient.post(roleConfig.endpoint, {
                    email: values.email,
                    password: values.password,
                }) as any

                const token = res.token || res.data?.token || res.accessToken

                if ((res.status === 'success' || token) && token) {
                    let userData = res.data
                    if (userData?.user) userData = userData.user
                    else if (userData?.student) userData = userData.student
                    else if (userData?.teacher) userData = userData.teacher

                    if (!userData?._id && res.data?._id) {
                        userData = res.data
                    }

                    if (userData && userData._id) {
                        login(
                            {
                                _id: userData._id,
                                id: userData._id,
                                name: userData.name,
                                email: userData.email,
                                role: roleConfig.id, // Authenticated Role
                                schoolId: userData.schoolId,
                                features: userData.features,
                            },
                            token
                        )

                        toast.success(`Welcome back, ${userData.name}!`)
                        success = true;

                        await new Promise((r) => setTimeout(r, 400))

                        const redirectMap: Record<string, string> = {
                            super_admin: "/superadmin/dashboard",
                            admin: "/admin/dashboard",
                            teacher: "/teacher/dashboard",
                            student: "/student/dashboard",
                        }

                        router.push(redirectMap[roleConfig.id] || "/dashboard")
                        break; // Stop on first success
                    }
                }
            } catch (error: any) {
                // Continue to next role if 401/404/400
                // Only log real errors, suppress auth failures during scanning
                if (error.response && error.response.status !== 401 && error.response.status !== 404 && error.response.status !== 400) {
                    console.error(`Login error for ${roleConfig.id}:`, error);
                }
            }
        }

        if (!success) {
            toast.error("Invalid email or password. Please try again.")
            setIsLoading(false)
        }
        // Note: setIsLoading(false) is handled in the failure case. 
        // In success case, we redirect, so we don't strictly need to unset loading immediately to prevent flash.
    }

    if (!isMounted) return null

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-sans">
            <div className="w-full max-w-[450px]">
                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 text-white shadow-lg shadow-primary/30">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Progress<span className="text-primary">LMS</span></span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8 sm:p-10 border border-slate-100 dark:border-slate-700">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Welcome to ProgressLMS</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Your all-in-one school management platform.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                disabled={isLoading}
                                                placeholder="username@school.com"
                                                className="h-11 font-medium bg-slate-50 dark:bg-slate-900/50"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-destructive" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</FormLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs font-semibold text-primary hover:text-primary-600 hover:underline"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    disabled={isLoading}
                                                    placeholder="••••••••••••"
                                                    className="h-11 font-medium pr-10 bg-slate-50 dark:bg-slate-900/50"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs text-destructive" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4.5 h-4.5 rounded text-primary border-slate-300 focus:ring-primary/20" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Remember this Device</span>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-sm tracking-wide mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">New to ProgressLMS? <Link href="/register" className="text-primary font-bold hover:underline">Create an account</Link></p>
                </div>
            </div>
        </div>
    )
}

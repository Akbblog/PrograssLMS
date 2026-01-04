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
    Users,
    Shield,
    Sparkles,
    CheckCircle2,
} from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"
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

        // Try the most privileged roles first to avoid super admins being treated as admins
        const attempts: RoleConfig[] = [
            roleConfigs.find(r => r.id === 'super_admin')!,
            roleConfigs.find(r => r.id === 'admin')!,
            roleConfigs.find(r => r.id === 'teacher')!,
            roleConfigs.find(r => r.id === 'student')!
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
                        // Prefer backend role if present, otherwise fall back to attempted role
                        const resolvedRole = (userData.role || roleConfig.id) as RoleType | string

                        login(
                            {
                                _id: userData._id,
                                id: userData._id,
                                name: userData.name,
                                email: userData.email,
                                role: resolvedRole,
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
                            superadmin: "/superadmin/dashboard",
                            admin: "/admin/dashboard",
                            teacher: "/teacher/dashboard",
                            student: "/student/dashboard",
                        }

                        const destination = redirectMap[resolvedRole] || redirectMap[roleConfig.id] || "/dashboard"
                        router.push(destination)
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

    const highlights = [
        "Role-aware access for super admins, admins, teachers, and students",
        "Unified academics, attendance, communication, and fees in one place",
        "Secure, audited logins with tenant isolation across schools",
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#5f2bff] via-[#4b23cc] to-[#0f1024] text-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
                <div className="space-y-7">
                    <div className="inline-flex items-center gap-3 px-3 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur shadow-lg shadow-indigo-500/20">
                        <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/80">ProgressLMS</p>
                            <p className="text-xs text-white/60">Built for modern schools</p>
                        </div>
                    </div>

                    <div className="space-y-3 max-w-2xl">
                        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Sign in to orchestrate your campus.</h1>
                        <p className="text-base text-white/70">Minimal, focused access to everything your school runs on—academics, operations, and people—secured by tenant-aware auth.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {highlights.map((item) => (
                            <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 shadow-sm shadow-indigo-900/20">
                                <div className="mt-0.5 text-emerald-300"><CheckCircle2 className="h-5 w-5" /></div>
                                <p className="text-sm text-white/80 leading-relaxed">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/95 text-slate-900 dark:bg-slate-900/90 dark:text-white rounded-3xl shadow-2xl shadow-indigo-900/30 backdrop-blur border border-white/20 dark:border-slate-800 p-8 sm:p-10">
                    <div className="space-y-2 mb-8">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold dark:bg-indigo-900/40 dark:text-indigo-100">
                            <Sparkles className="h-4 w-4" />
                            Single sign-on for every role
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Use your school email to continue.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                disabled={isLoading}
                                                placeholder="you@school.com"
                                                className="h-11 font-medium bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
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
                                            <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</FormLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-200 dark:hover:text-white"
                                            >
                                                Forgot?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    disabled={isLoading}
                                                    placeholder="••••••••"
                                                    className="h-11 font-medium pr-10 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200" />
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Remember this device</span>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-sm text-slate-600 dark:text-slate-400 text-center">
                        New to ProgressLMS? <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-200 dark:hover:text-white">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

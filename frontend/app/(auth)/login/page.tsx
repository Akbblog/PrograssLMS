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

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.14),transparent_40%)]" aria-hidden />
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_35%,transparent_70%)]" aria-hidden />

            <div className="w-full max-w-5xl grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center relative z-10">
                <div className="hidden lg:flex flex-col gap-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-10 shadow-2xl shadow-indigo-900/40">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <GraduationCap className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white/80">ProgressLMS</p>
                            <p className="text-xs text-white/60">Secure access hub</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold leading-tight">Welcome back</h1>
                        <p className="text-white/70 text-sm">Sign in to continue to your workspace.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Secure sessions</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Role-aware access</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Unified academics</div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Comms & attendance</div>
                    </div>
                </div>

                <div className="rounded-3xl bg-white/95 text-slate-900 dark:bg-slate-900/95 dark:text-white border border-white/10 dark:border-slate-800 shadow-2xl shadow-indigo-900/30 backdrop-blur p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-200">ProgressLMS</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Sign in</p>
                            </div>
                        </div>
                        <Sparkles className="h-5 w-5 text-indigo-400" />
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
                </div>
            </div>
        </div>
    )
}

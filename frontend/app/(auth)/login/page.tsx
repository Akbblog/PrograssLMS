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
    Mail,
    Lock
} from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import apiClient from "@/lib/api/client"
import { cn } from "@/lib/utils"

// --- Validation Schema ---
const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

type FormValues = z.infer<typeof formSchema>

// --- Role Config (Logic Preserved) ---
type RoleType = 'student' | 'teacher' | 'admin' | 'super_admin';

interface RoleConfig {
    id: RoleType;
    label: string;
    icon: any;
    endpoint: string;
}

const roleConfigs: RoleConfig[] = [
    { id: 'student', label: 'Student', icon: GraduationCap, endpoint: '/students/login' },
    { id: 'teacher', label: 'Teacher', icon: Users, endpoint: '/teachers/login' },
    { id: 'admin', label: 'Administrator', icon: Shield, endpoint: '/admin/login' },
    { id: 'super_admin', label: 'Super Admin', icon: Sparkles, endpoint: '/superadmin/login' }
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

    // --- Unified Login Logic (Preserved) ---
    async function onSubmit(values: FormValues) {
        setIsLoading(true)

        const attempts: RoleConfig[] = [
            roleConfigs.find(r => r.id === 'super_admin')!,
            roleConfigs.find(r => r.id === 'admin')!,
            roleConfigs.find(r => r.id === 'teacher')!,
            roleConfigs.find(r => r.id === 'student')!
        ];

        let success = false;

        for (const roleConfig of attempts) {
            try {
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
                        break;
                    }
                }
            } catch (error: any) {
                if (error.response && error.response.status !== 401 && error.response.status !== 404 && error.response.status !== 400) {
                    console.error(`Login error for ${roleConfig.id}:`, error);
                }
            }
        }

        if (!success) {
            toast.error("Invalid email or password. Please try again.")
            setIsLoading(false)
        }
    }

    if (!isMounted) return null

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden font-sans selection:bg-indigo-500/30">
            
            {/* --- Modern Background Effects --- */}
            <div className="absolute inset-0 w-full h-full">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Gradient Globs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
                <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[80px]" />
            </div>

            {/* --- Main Card --- */}
            <div className="relative z-10 w-full max-w-[420px] mx-4">
                <div className="relative rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
                    
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

                    <div className="p-8 sm:p-10">
                        {/* Header Section */}
                        <div className="text-center space-y-6 mb-8">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 mb-2 ring-1 ring-white/10">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                            
                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                    Welcome back
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    Enter your credentials to access your workspace
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs uppercase tracking-wider text-slate-400 font-medium ml-1">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        disabled={isLoading}
                                                        placeholder="name@school.com"
                                                        className="h-12 pl-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all hover:border-slate-700"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between ml-1">
                                                <FormLabel className="text-xs uppercase tracking-wider text-slate-400 font-medium">Password</FormLabel>
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <div className="relative group">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        disabled={isLoading}
                                                        placeholder="••••••••"
                                                        className="h-12 pl-10 pr-10 bg-slate-950/50 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-xl focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all hover:border-slate-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 mt-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </div>

                    {/* Footer / Meta Area */}
                    <div className="bg-slate-950/30 p-4 text-center border-t border-white/5">
                        <p className="text-xs text-slate-500">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
                
                {/* Floating "Secure" Badge */}
                <div className="mt-8 flex justify-center">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                        <Shield className="h-3 w-3 text-emerald-400" />
                        <span className="text-xs font-medium text-slate-400">End-to-end encrypted session</span>
                   </div>
                </div>
            </div>
        </div>
    )
}
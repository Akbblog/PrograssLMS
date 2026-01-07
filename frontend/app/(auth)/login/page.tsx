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
    Lock,
    ArrowRight
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

                // Handle multiple response formats from backend
                // Backend returns: {success: true, data: {...}, message: '...'}
                const responseData = res.data || res;
                const token = responseData.token || responseData.data?.token;
                
                // Get user data from various possible locations
                let userData = responseData.data;
                if (userData?.user) userData = userData.user;
                else if (userData?.student) userData = userData.student;
                else if (userData?.teacher) userData = userData.teacher;
                else if (userData?.admin) userData = userData.admin;
                else if (!userData?.name && responseData.student) userData = responseData.student;
                else if (!userData?.name && responseData.teacher) userData = responseData.teacher;
                else if (!userData?.name && responseData.admin) userData = responseData.admin;

                if ((responseData.success || token) && token && userData && userData.name) {
                    const resolvedRole = (userData.role || roleConfig.id) as RoleType | string

                    login(
                        {
                            _id: userData._id || userData.id,
                            id: userData._id || userData.id,
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
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
            
            {/* --- Modern White Background Effects --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                {/* Subtle mesh gradient background */}
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-blue-100/60 to-indigo-100/60 blur-[120px] animate-slow-drift opacity-70" />
                 <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-violet-100/60 to-fuchsia-100/60 blur-[120px] animate-slow-drift-reverse opacity-70" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay"></div>
            </div>


            {/* --- Main Card --- */}
            <div className="relative z-10 w-full max-w-[440px] mx-auto p-4">
                
                {/* The "Floating" White Card */}
                <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-slate-100/80 p-8 sm:p-12 relative overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="text-center space-y-4 mb-10">
                        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 shadow-sm shadow-blue-100 ring-1 ring-blue-100/50 mb-2">
                            <GraduationCap className="h-7 w-7" />
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Welcome back
                            </h1>
                            <p className="text-slate-500 text-[15px]">
                                Please enter your details to sign in.
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-sm font-medium text-slate-700 ml-1">Email address</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    disabled={isLoading}
                                                    placeholder="name@school.com"
                                                    className="h-14 pl-12 bg-slate-50/80 border-0 text-slate-900 placeholder:text-slate-400 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:bg-white transition-all shadow-sm shadow-slate-200/50"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs ml-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-sm font-medium text-slate-700 ml-1">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    disabled={isLoading}
                                                    placeholder="••••••••"
                                                     className="h-14 pl-12 pr-12 bg-slate-50/80 border-0 text-slate-900 placeholder:text-slate-400 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:bg-white transition-all shadow-sm shadow-slate-200/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs ml-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all" />
                                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        Sign in
                                        <ArrowRight className="h-5 w-5 opacity-70" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Footer area */}
                    <div className="mt-10 text-center">
                         <p className="text-sm text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                Sign up now
                            </Link>
                        </p>
                    </div>
                </div>
                
                {/* Subtle bottom text */}
                <p className="text-center text-xs font-medium text-slate-400 mt-6">
                    © 2026 ProgressLMS. Secured by industry standards.
                </p>
            </div>
        </div>
    )
}
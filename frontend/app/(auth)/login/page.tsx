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
    ArrowRight,
} from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap" // Preserving your import
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import apiClient from "@/lib/api/client"

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

    async function onSubmit(values: FormValues) {
        setIsLoading(true)

        const attempts: RoleConfig[] = [
            roleConfigs.find(r => r.id === 'super_admin')!,
            roleConfigs.find(r => r.id === 'admin')!,
            roleConfigs.find(r => r.id === 'teacher')!,
            roleConfigs.find(r => r.id === 'student')!
        ]

        for (const roleConfig of attempts) {
            try {
                const response = await apiClient.post(roleConfig.endpoint, {
                    email: values.email,
                    password: values.password,
                }) as any

                const envelope = response ?? {}
                const payload = envelope?.data ?? envelope
                const token = payload?.token ?? envelope?.token

                // Support the various payload shapes returned by different auth endpoints
                let userData = payload?.user
                    || payload?.teacher
                    || payload?.student
                    || payload?.admin
                    || (payload?.name && payload?.email ? payload : undefined)

                if (!userData) {
                    userData = envelope?.user
                        || envelope?.teacher
                        || envelope?.student
                        || envelope?.admin
                        || (envelope?.name && envelope?.email ? envelope : undefined)
                }

                if (token && userData?.name) {
                    const resolvedRole = (userData.role || roleConfig.id) as RoleType | string

                    let features = userData.features
                    if (typeof features === 'string') {
                        try {
                            features = JSON.parse(features)
                        } catch (error) {
                            features = {}
                        }
                    }

                    login(
                        {
                            _id: userData._id || userData.id,
                            id: userData._id || userData.id,
                            name: userData.name,
                            email: userData.email,
                            role: resolvedRole,
                            schoolId: userData.schoolId,
                            features: features || {},
                        },
                        token
                    )

                    toast.success(`Welcome back, ${userData.name}!`)
                    setIsLoading(false)

                    await new Promise((resolve) => setTimeout(resolve, 400))

                    const redirectMap: Record<string, string> = {
                        super_admin: "/superadmin/dashboard",
                        superadmin: "/superadmin/dashboard",
                        admin: "/admin/dashboard",
                        teacher: "/teacher/dashboard",
                        student: "/student/dashboard",
                    }

                    const destination = redirectMap[resolvedRole] || redirectMap[roleConfig.id] || "/dashboard"
                    router.push(destination)
                    return
                }
            } catch (error: any) {
                if (error.response && error.response.status !== 401 && error.response.status !== 404 && error.response.status !== 400) {
                    console.error(`Login error for ${roleConfig.id}:`, error)
                }
            }
        }

        toast.error("Invalid email or password. Please try again.")
        setIsLoading(false)
    }

    if (!isMounted) return null

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans selection:bg-blue-500/30">
            
            {/* --- ABSTRACT BACKGROUND ENGINE --- */}
            
            {/* 1. Base Color */}
            <div className="absolute inset-0 bg-slate-50"></div>

            {/* 2. Fluid Gradient Blobs (The "Lava Lamp" Effect) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-[60px] opacity-60 animate-blob animation-delay-6000"></div>
            </div>

            {/* 3. Noise Texture Overlay (Adds the "Premium" Matte Finish) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.4] pointer-events-none z-[1]">
                <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>

            {/* 4. Subtle Grid Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.15] z-[0]"
                style={{
                    backgroundImage: `linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)`,
                    backgroundSize: '4rem 4rem',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            {/* --- GLOBAL STYLES FOR ANIMATION --- */}
            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 10s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-6000 {
                    animation-delay: 6s;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.65);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
                }
            `}</style>


            {/* --- MAIN CARD --- */}
            <div className="relative z-10 w-full max-w-[460px] mx-auto p-4">
                
                {/* The Glass Prism Card */}
                <div className="glass-card rounded-[32px] border border-white/60 p-8 sm:p-12 relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(8,_112,_184,_0.12)]">
                    
                    {/* Top Lighting Effect for Card */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-70" />

                    {/* Header Section */}
                    <div className="text-center space-y-4 mb-10">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-2 transform transition-transform hover:scale-105 duration-300">
                            <GraduationCap className="h-8 w-8" />
                        </div>
                        
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Welcome Back
                            </h1>
                            <p className="text-slate-500 text-[15px] max-w-[280px] mx-auto leading-relaxed">
                                Enter your credentials to access your personalized learning dashboard.
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
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">
                                                    <Mail className="h-5 w-5" />
                                                </div>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    disabled={isLoading}
                                                    className="h-14 pl-12 bg-white/50 border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm"
                                                    placeholder="name@school.com"
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
                                    <FormItem className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                             <FormLabel className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Password</FormLabel>
                                        </div>
                                        <FormControl>
                                            <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-300">
                                                    <Lock className="h-5 w-5" />
                                                </div>
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    disabled={isLoading}
                                                    className="h-14 pl-12 pr-12 bg-white/50 border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 focus-visible:bg-white transition-all shadow-sm"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-2 rounded-full hover:bg-slate-100/50"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-xs ml-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer group select-none">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-all cursor-pointer" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-semibold text-blue-600 hover:text-indigo-600 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white text-[15px] font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:scale-[1.01] active:scale-[0.98] mt-2 relative overflow-hidden group"
                                disabled={isLoading}
                            >
                                {/* Button Gradient Shine Effect */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                                        <span>Verifying...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Sign In
                                        <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Footer area */}
                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                         <p className="text-sm text-slate-500 font-medium">
                            New here?{' '}
                            <Link href="/signup" className="text-blue-600 hover:text-indigo-600 font-bold transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
                
                {/* Clean, minimal footer */}
                <div className="flex items-center justify-center gap-6 mt-8 opacity-60">
                     <span className="text-xs font-medium text-slate-500">Privacy</span>
                     <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                     <span className="text-xs font-medium text-slate-500">Terms</span>
                     <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                     <span className="text-xs font-medium text-slate-500">Help</span>
                </div>
            </div>
            
            {/* --- Tailwind Config for Shimmer (injected via style for simplicity) --- */}
            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .group-hover\:animate-shimmer:hover {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    )
}
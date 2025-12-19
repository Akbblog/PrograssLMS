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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff, GraduationCap, Mail, Shield, BookOpen, Users } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import apiClient from "@/lib/api/client"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
    const router = useRouter()
    const login = useAuthStore((state) => state.login)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        try {
            // Try login endpoints in order until one succeeds so user doesn't need to select role
            const tryOrder: Array<{ role: string; endpoint: string }> = [
                { role: 'super_admin', endpoint: '/superadmin/login' },
                { role: 'admin', endpoint: '/admin/login' },
                { role: 'teacher', endpoint: '/teacher/login' },
                { role: 'student', endpoint: '/students/login' },
            ]

            let success: { role: string; data: any; token: string } | null = null

            for (const attempt of tryOrder) {
                try {
                    const res = await apiClient.post(attempt.endpoint, {
                        email: values.email,
                        password: values.password,
                    }) as any // Response interceptor returns response.data directly

                    // After axios interceptor, res IS response.data directly
                    // API returns: { status, data: {user info}, token }
                    // So res.token is the token, res.data is user data

                    // Check for token at response level first, then nested
                    const token = res.token || res.data?.token || res.accessToken

                    // Check if login was successful
                    if ((res.status === 'success' || token) && token) {
                        // Get user data - could be at res.data or nested further
                        let userData = res.data

                        // If data contains user/student/teacher property, use that
                        if (userData?.user) userData = userData.user
                        else if (userData?.student) userData = userData.student
                        else if (userData?.teacher) userData = userData.teacher

                        // Fallback for Superadmin where data IS the user directly
                        if (!userData?._id && res.data?._id) {
                            userData = res.data
                        }

                        if (userData && userData._id) {
                            success = { role: attempt.role, data: userData, token }
                            break
                        }
                    }
                } catch (err) {
                    // ignore and try next
                }
            }

            if (!success) {
                throw new Error('Invalid login credentials')
            }

            // Store user and token
            login(
                {
                    _id: success.data._id,
                    id: success.data._id,
                    name: success.data.name,
                    email: success.data.email,
                    role: success.role,
                    schoolId: success.data.schoolId,
                    features: success.data.features,
                },
                success.token
            )

            toast.success(`Welcome back, ${success.data.name}!`)

            // small delay to allow animation/feedback
            await new Promise((r) => setTimeout(r, 300))

            const redirectMap: Record<string, string> = {
                super_admin: "/superadmin/dashboard",
                admin: "/admin/dashboard",
                teacher: "/teacher/dashboard",
                student: "/student/dashboard",
            }

            const redirectUrl = redirectMap[success.role] || "/dashboard"
            router.push(redirectUrl)
        } catch (error: any) {
            console.error("Login error:", error)
            const errorMessage = error.response?.data?.message || "Invalid email or password. Please try again."
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Feature Showcase */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-wide text-white">Progress LMS</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold text-white leading-tight">
                            Welcome to Your<br />
                            <span className="text-indigo-200">Learning Portal</span>
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-md leading-relaxed">
                            Access your personalized dashboard, manage courses, track progress, and achieve your educational goals.
                        </p>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Smart Learning</p>
                            <p className="text-sm text-indigo-200">Access courses & materials anytime</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Collaborative</p>
                            <p className="text-sm text-indigo-200">Connect with teachers & peers</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Secure Platform</p>
                            <p className="text-sm text-indigo-200">Your data is always protected</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 pt-8">
                    <p className="text-indigo-200 text-sm">© 2024 Progress LMS. All rights reserved.</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">Progress LMS</span>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
                            <p className="text-slate-500">Enter your credentials to access your dashboard</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-medium">Email Address</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                    <Input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        className="pl-10 h-12 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                                                        autoComplete="email"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between mb-1">
                                                <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter your password"
                                                        className="h-12 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 pr-12 transition-all"
                                                        autoComplete="current-password"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                                        tabIndex={-1}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        </Form>

                        {/* Contact Link - Replaced Register */}
                        <div className="mt-6 text-center">
                            <p className="text-slate-500 text-sm">
                                Need access to the system?{" "}
                                <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                                    Contact Us
                                </Link>
                            </p>
                        </div>


                    </div>

                    {/* Footer */}
                    <p className="text-center text-slate-400 text-xs mt-6">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

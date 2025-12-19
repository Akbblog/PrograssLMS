'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Loader2, ArrowLeft, Mail } from 'lucide-react'
import { toast } from 'sonner'
import apiClient from '@/lib/api/client'

const formSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
})

type FormValues = z.infer<typeof formSchema>

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        try {
            // Call backend to send reset email
            const response = await apiClient.post('/auth/forgot-password', {
                email: values.email,
            })

            if (response.data.status === 'success') {
                setSubmitted(true)
                toast.success('Password reset email sent! Check your inbox.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email.'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
                </div>

                <Card className="w-full max-w-md relative z-10 border-slate-700 bg-slate-800">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-green-500/10 p-4">
                                <Mail className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">Check your email</CardTitle>
                        <CardDescription className="text-slate-400 mt-2">
                            We've sent password reset instructions to {form.getValues('email')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-slate-300 text-center">
                            Click the link in the email to reset your password. The link will expire in 1 hour.
                        </p>
                        <p className="text-sm text-slate-400 text-center">
                            Didn't receive the email? Check your spam folder or try again with a different email address.
                        </p>
                        <Link href="/login" className="block w-full">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <Card className="w-full max-w-md relative z-10 border-slate-700 bg-slate-800">
                <CardHeader>
                    <div className="flex justify-center mb-2">
                        <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <CardTitle className="text-2xl font-bold text-white">Reset your password</CardTitle>
                        <CardDescription className="text-slate-400 mt-2">
                            Enter your email address and we'll send you a link to reset your password
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="name@example.com"
                                                className="border-slate-600 bg-slate-700 text-slate-100 placeholder:text-slate-500"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-10"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <div className="px-6 py-4 border-t border-slate-700 text-center">
                    <Link href="/login" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </Card>
        </div>
    )
}

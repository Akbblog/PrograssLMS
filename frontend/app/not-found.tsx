'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md text-center">
                {/* Logo */}
                <div className="mb-8">
                    <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-2xl">D</span>
                    </div>
                </div>

                {/* Error Code */}
                <div className="mb-6">
                    <h1 className="text-9xl font-bold text-gray-200 mb-2">404</h1>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                    <p className="text-gray-600">The page you're looking for doesn't exist. It might have been moved or deleted.</p>
                </div>

                {/* Error Illustration */}
                <div className="mb-8">
                    <div className="text-6xl">🔍</div>
                </div>

                {/* Error Message */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
                    <p className="text-sm text-orange-900">
                        Error Code: <span className="font-mono font-semibold">404 NOT_FOUND</span>
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Link href="/">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2">
                            <Home className="w-4 h-4" />
                            Go to Home
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" className="w-full border-gray-200 text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            Back to Login
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? <a href="mailto:support@school.com" className="text-orange-500 hover:text-orange-600">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

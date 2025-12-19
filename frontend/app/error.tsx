'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw } from 'lucide-react'

export default function ServerError() {
    const handleReload = () => {
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md text-center">
                {/* Logo */}
                <div className="mb-8">
                    <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-2xl">!</span>
                    </div>
                </div>

                {/* Error Code */}
                <div className="mb-6">
                    <h1 className="text-9xl font-bold text-gray-200 mb-2">500</h1>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Server Error</h2>
                    <p className="text-gray-600">Something went wrong on our end. Please try again later.</p>
                </div>

                {/* Error Illustration */}
                <div className="mb-8">
                    <div className="text-6xl">⚙️</div>
                </div>

                {/* Error Message */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                    <p className="text-sm text-red-900">
                        Error Code: <span className="font-mono font-semibold">500 INTERNAL_SERVER_ERROR</span>
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Button onClick={handleReload} className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="w-full border-gray-200 text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2">
                            <Home className="w-4 h-4" />
                            Go to Home
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Need help? <a href="mailto:support@school.com" className="text-red-500 hover:text-red-600">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

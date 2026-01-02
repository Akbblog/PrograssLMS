import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock, Home, ArrowRight, ShieldAlert, HelpCircle } from 'lucide-react'

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4 sm:p-6">
            <div className="max-w-md w-full">
                {/* Card Container */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6 sm:p-8 text-center animate-scaleIn">
                    {/* Icon */}
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-200 animate-float">
                            <ShieldAlert className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Error Code */}
                    <div className="mb-6">
                        <h1 className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent mb-3">
                            403
                        </h1>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-slate-500">
                            You don't have permission to access this page.
                        </p>
                    </div>

                    {/* Error Message */}
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3 text-left">
                            <Lock className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-rose-900 mb-1">
                                    Permission Required
                                </p>
                                <p className="text-xs text-rose-700">
                                    Your current role doesn't have the required permissions to view this page.
                                    Please login with appropriate credentials or contact your administrator.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <Link href="/login" className="w-full">
                            <Button className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300">
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Back to Login
                            </Button>
                        </Link>
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                                <Home className="w-4 h-4 mr-2" />
                                Go to Home
                            </Button>
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                            <HelpCircle className="w-4 h-4" />
                            <span>
                                Need help?{' '}
                                <a href="mailto:support@school.com" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                    Contact Administrator
                                </a>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    Progress LMS © 2024. All rights reserved.
                </p>
            </div>
        </div>
    )
}

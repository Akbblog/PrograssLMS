"use client"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Progress LMS</h1>
        <p className="text-xl text-slate-600 mb-8">Hello World - Testing Deployment</p>
        <a
          href="/login"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-4">About Our LMS</h1>
      <p className="mb-6 text-muted-foreground">We build an enterprise-ready, multi-tenant learning management system that helps schools manage exams, results, attendance, and analytics — fast and secure.</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="mb-4">To empower schools with modern tools that improve teaching and learning outcomes while simplifying administration.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Get Started</h2>
        <p className="mb-4">If you're ready to try the demo or manage schools, visit the Super Admin area or contact us for a custom deployment.</p>
        <div className="flex gap-3">
          <Link href="/contact" className="px-4 py-2 bg-indigo-600 text-white rounded">Contact Us</Link>
          <Link href="/superadmin/dashboard" className="px-4 py-2 border rounded">Super Admin</Link>
        </div>
      </section>
    </div>
  )
}

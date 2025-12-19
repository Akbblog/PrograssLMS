"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import SchoolAdminSidebar from "@/components/layout/SchoolAdminSidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function SchoolAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
            <div className="hidden border-r bg-white md:block">
                <SchoolAdminSidebar />
            </div>
            <div className="flex flex-col">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50">
                    {children}
                </main>
            </div>

            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-[240px]">
                    <SchoolAdminSidebar />
                </SheetContent>
            </Sheet>
        </div>
    )
}

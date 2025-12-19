"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <Sidebar />
            </div>
            <div className="flex flex-col">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/10">
                    {children}
                </main>
            </div>

            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="left" className="p-0 w-[240px]">
                    <Sidebar />
                </SheetContent>
            </Sheet>
        </div>
    )
}

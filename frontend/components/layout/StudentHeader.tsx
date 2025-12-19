"use client";

import { useAuthStore } from "@/store/authStore";
import { Search, Bell } from "lucide-react";

export default function StudentHeader() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="flex items-center gap-2 flex-1 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search courses, assignments..."
                        className="bg-transparent text-sm outline-none w-full text-slate-900 placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0) || "S"}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-slate-900">{user?.name || "Student"}</p>
                        <p className="text-xs text-slate-500">Student</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

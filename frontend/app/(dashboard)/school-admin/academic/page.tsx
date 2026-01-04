"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Clock, Layers, Library } from "lucide-react"
import GraduationCap from "@/components/icons/GraduationCap"

const academicModules = [
    {
        title: "Classes & Sections",
        description: "Manage class levels, sections, and student assignments.",
        icon: Layers,
        href: "/school-admin/academic/classes",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Subjects",
        description: "Configure subjects and assign them to classes.",
        icon: BookOpen,
        href: "/school-admin/academic/subjects",
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Academic Years",
        description: "Set up academic years and active sessions.",
        icon: Calendar,
        href: "/school-admin/academic/years",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Terms & Semesters",
        description: "Manage academic terms and grading periods.",
        icon: Clock,
        href: "/school-admin/academic/terms",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
    {
        title: "Programs",
        description: "Define educational programs and curriculums.",
        icon: Library,
        href: "/school-admin/academic/programs",
        color: "text-red-600",
        bgColor: "bg-red-50",
    },
    {
        title: "Promotions",
        description: "Manage student promotions to the next class.",
        icon: GraduationCap,
        href: "/school-admin/academic/promotions",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
    },
]

export default function AcademicPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Academic Management</h1>
                <p className="text-muted-foreground">Configure and manage your school's academic structure.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {academicModules.map((module) => (
                    <Link key={module.title} href={module.href}>
                        <Card className="h-full transition-all hover:shadow-md hover:border-indigo-200 cursor-pointer">
                            <CardHeader>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${module.bgColor}`}>
                                    <module.icon className={`h-5 w-5 ${module.color}`} />
                                </div>
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                <CardDescription>{module.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

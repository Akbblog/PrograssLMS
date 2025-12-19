"use client";

// This page redirects to the create student page
import { redirect } from "next/navigation";

export default function RegisterStudentPage() {
    redirect("/admin/students/create");
}

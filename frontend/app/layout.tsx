import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import GlobalSearchActivator from '@/components/search/GlobalSearchActivator'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@/lib/queryClient'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School Management System",
  description: "Complete LMS for managing schools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors />
          {/* Global search activator for keyboard shortcut only */}
          <GlobalSearchActivator />
        </QueryClientProvider>
      </body>
    </html>
  );
}
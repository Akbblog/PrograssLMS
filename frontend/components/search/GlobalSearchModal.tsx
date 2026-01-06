"use client"
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSearchStore } from '@/store/searchStore';
import { Search, Clock, ArrowRight, Loader2, User, BookOpen, GraduationCap, Settings, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
    students: <User className="w-4 h-4" />,
    teachers: <GraduationCap className="w-4 h-4" />,
    classes: <BookOpen className="w-4 h-4" />,
    settings: <Settings className="w-4 h-4" />,
    default: <FileText className="w-4 h-4" />,
};

export default function GlobalSearchModal() {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        isOpen,
        query,
        setQuery,
        results,
        selectedIndex,
        selectNext,
        selectPrevious,
        executeSelected,
        isLoading,
        recentSearches,
        close,
        search,
    } = useSearchStore();

    // Focus input when modal opens
    useEffect(() => {
        "use client"
        import React from 'react'

        // Deprecated: search UI was replaced by inline `SearchDropdown`.
        // Keep this component as a no-op to avoid import errors from other files.
        export default function GlobalSearchModal() {
          return null
        }
        const handler = (e: KeyboardEvent) => {

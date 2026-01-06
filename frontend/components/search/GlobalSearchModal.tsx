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
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); selectNext(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); selectPrevious(); }
            else if (e.key === 'Enter') { e.preventDefault(); executeSelected(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, selectNext, selectPrevious, executeSelected]);

    // Debounced search
    useEffect(() => {
        const debounce = setTimeout(() => {
            if (isOpen && query.length >= 2) search(query);
        }, 300);
        return () => clearTimeout(debounce);
    }, [query, isOpen, search]);

    const allResults = Object.entries(results);
    const flatResults = allResults.flatMap(([cat, items]) =>
        items.map((item) => ({ ...item, category: cat }))
    );

    const handleResultClick = (result: any) => {
        if (result.route) {
            router.push(result.route);
            close();
        }
    };

// Deprecated: replaced by inline SearchDropdown. Keep for backward compatibility if needed.
export default function GlobalSearchModal() {
    return null;
}
                <VisuallyHidden>
                    <DialogDescription>Search across students, teachers, classes, and settings</DialogDescription>
                </VisuallyHidden>

                {/* Search Input Header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b bg-slate-50/50 dark:bg-slate-900/50">
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                        <Search className="w-5 h-5 text-slate-400" />
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search students, teachers, classes, settings..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent text-base outline-none placeholder:text-slate-400"
                    />
                    <kbd className="hidden sm:block text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">ESC</kbd>
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {/* Recent Searches */}
                    {query.length < 2 && recentSearches.length > 0 && (
                        <div className="p-4 border-b">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Recent Searches
                            </div>
                            <div className="space-y-1">
                                {recentSearches.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(q)}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">{q}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {!isLoading && flatResults.length === 0 && query.length >= 2 && (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No results found</h3>
                            <p className="text-sm text-slate-500 mt-1">Try a different search term</p>
                        </div>
                    )}

                    {/* Search Results by Category */}
                    {allResults.map(([category, items]) => (
                        <div key={category} className="border-b last:border-b-0">
                            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    {category} ({items.length})
                                </span>
                            </div>
                            <div className="p-2">
                                {items.map((item, idx) => {
                                    const globalIndex = flatResults.findIndex(
                                        (fr) => fr.id === item.id && fr.category === category
                                    );
                                    const isSelected = globalIndex === selectedIndex;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleResultClick(item)}
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
                                                isSelected
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                {item.photo ? (
                                                    <img src={item.photo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                                ) : (
                                                    categoryIcons[category] || categoryIcons.default
                                                )}
                                            </div>
                                            <div className="flex-1 text-left min-w-0">
                                                <div className="font-medium text-sm truncate">{item.title}</div>
                                                {item.subtitle && (
                                                    <div className="text-xs text-slate-500 truncate">{item.subtitle}</div>
                                                )}
                                            </div>
                                            {item.badge && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer with Keyboard Hints */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t flex items-center gap-6 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↑</kbd>
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">↓</kbd>
                        <span className="ml-1">Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">Enter</kbd>
                        <span className="ml-1">Open</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">Esc</kbd>
                        <span className="ml-1">Close</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

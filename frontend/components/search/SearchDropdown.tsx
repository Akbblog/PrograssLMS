"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useSearchStore } from '@/store/searchStore'
import { Search as SearchIcon, Loader2, User, BookOpen, GraduationCap, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categoryIcons: Record<string, React.ReactNode> = {
  students: <User className="w-4 h-4" />,
  teachers: <GraduationCap className="w-4 h-4" />,
  classes: <BookOpen className="w-4 h-4" />,
  default: <FileText className="w-4 h-4" />,
}

export default function SearchDropdown() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { query, setQuery, results, isLoading, isOpen, open, close, search, executeSelected } = useSearchStore()
  const [visible, setVisible] = useState(false)

  // Open dropdown when store.isOpen is true
  useEffect(() => setVisible(isOpen), [isOpen])

  // Keep focus on input when opened
  useEffect(() => {
    if (visible && inputRef.current) inputRef.current.focus()
  }, [visible])

  // Debounced search handled by store; keep ESC/outside click behavior simple
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
      if (e.key === 'Enter') {
        executeSelected();
      }
    }
    const onClick = (ev: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(ev.target as Node)) {
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [close, executeSelected])

  // Trigger search when query changes (store already handles debounce)
  useEffect(() => {
    if (query.length >= 2) search(query)
  }, [query, search])

  const handleNavigate = (route?: string) => {
    if (route) {
      router.push(route)
      close()
    }
  }

  const grouped = Object.entries(results || {})

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-3 px-3 py-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-full border border-transparent hover:border-slate-200 transition-all">
        <SearchIcon className="w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (!isOpen) open(); }}
          placeholder="Search students, teachers, classes..."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
        />
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
      </div>

      {visible && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-md z-50 max-h-72 overflow-auto">
          {grouped.length === 0 && query.length < 2 && (
            <div className="p-3 text-sm text-slate-500">Type at least 2 characters to search</div>
          )}
          {grouped.length === 0 && query.length >= 2 && !isLoading && (
            <div className="p-4 text-sm text-slate-500">No results found</div>
          )}
          {grouped.map(([category, items]) => (
            <div key={category} className="border-b last:border-b-0">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">{category} ({items.length})</div>
              <div className="space-y-1 px-2 pb-2">
                {items.map((it: any) => (
                  <button key={it.id} onClick={() => handleNavigate(it.route)} className="w-full text-left flex items-center gap-3 px-2 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-900">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">{categoryIcons[category] || categoryIcons.default}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{it.title}</div>
                      {it.subtitle && <div className="text-xs text-slate-500 truncate">{it.subtitle}</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

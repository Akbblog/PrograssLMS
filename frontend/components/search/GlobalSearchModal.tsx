"use client"

import React, { useEffect, useRef } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { useSearchStore } from '../../store/searchStore';
import { CategoryHeader } from './CategoryHeader';
import { SearchResultItem } from './SearchResultItem';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function GlobalSearchModal() {
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
    open,
    close,
    activeCategory,
    search,
  } = useSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); selectNext(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectPrevious(); }
      else if (e.key === 'Enter') { e.preventDefault(); executeSelected(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') { /* category switching logic */ }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, selectNext, selectPrevious, executeSelected, close]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (isOpen && query.length >= 2) search(query);
    }, 300);
    return () => clearTimeout(debounce);
  }, [query, isOpen, search]);

  // Virtualizer setup
  const allResults = Object.entries(results);
  const flatResults = allResults.flatMap(([cat, items]) => items.map((item, idx) => ({ ...item, category: cat, idx })));
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: flatResults.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(v: boolean) => v ? open() : close()}>
      <div style={{ width: 640, maxHeight: '70vh', top: '10%', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="px-6 pt-6 pb-2">
          <input
            ref={inputRef}
            className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-slate-900 text-lg"
            placeholder="Search or press ⌘K..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div ref={parentRef} className="overflow-auto" style={{ maxHeight: '50vh' }}>
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="px-6 pb-2">
              <div className="text-xs text-slate-400 mb-2">RECENT SEARCHES</div>
              {recentSearches.map((q, i) => (
                <div key={i} className="flex items-center gap-2 py-1 cursor-pointer" onClick={() => setQuery(q)}>
                  <span>🕐</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          )}
          {isLoading && <div className="px-6 py-4 text-center text-slate-400">Loading...</div>}
          {!isLoading && flatResults.length === 0 && query.length >= 2 && (
            <div className="px-6 py-4 text-center text-slate-400">No results found</div>
          )}
          {allResults.map(([category, items], i) => (
            <div key={category} className="px-6 pb-2">
              <CategoryHeader category={category} count={items.length} />
              {items.map((item, idx) => (
                <SearchResultItem
                  key={item.id}
                  result={item}
                  selected={flatResults[rowVirtualizer.getVirtualItems()[0]?.index]?.idx === idx && flatResults[rowVirtualizer.getVirtualItems()[0]?.index]?.category === category}
                />
              ))}
              {items.length >= 5 && (
                <div className="text-xs text-blue-500 cursor-pointer mt-1">See all {items.length} →</div>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-2 border-t text-xs text-slate-400 flex gap-6 items-center">
          <KeyboardHints />
        </div>
      </div>
    </Dialog>
  );
};

export const KeyboardHints: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="text-xs text-slate-400">Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Enter</kbd> to open</div>
      <div className="text-xs text-slate-400">Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">Esc</kbd> to close</div>
      <div className="ml-auto text-xs text-slate-400">Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">/</kbd> to focus</div>
    </div>
  );
};

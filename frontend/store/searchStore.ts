import { create } from 'zustand';
import Fuse from 'fuse.js';
import { searchAPI } from '@/lib/api/endpoints';

export interface SearchResult {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  route?: string;
  photo?: string;
  highlight?: string[];
}

export interface SearchResults {
  [category: string]: SearchResult[];
}

export interface SearchState {
  isOpen: boolean;
  query: string;
  results: SearchResults;
  selectedIndex: number;
  isLoading: boolean;
  recentSearches: string[];
  activeCategory: string | null;
}

export interface SearchActions {
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  selectNext: () => void;
  selectPrevious: () => void;
  executeSelected: () => void;
  addToRecent: (query: string) => void;
}

const RECENT_KEY = 'lms_recent_searches';
const MAX_RECENT = 5;

export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
  isOpen: false,
  query: '',
  results: {},
  selectedIndex: 0,
  isLoading: false,
  recentSearches: (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') : []),
  activeCategory: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, query: '', results: {}, selectedIndex: 0, activeCategory: null }),
  setQuery: (query) => set({ query }),
  search: async (query) => {
    if (query.length < 2) {
      set({ results: {} });
      return;
    }
    set({ isLoading: true });
    try {
      const categories = get().activeCategory || undefined;
      const raw = await searchAPI.global(query, categories as any);
      const data: any = raw as any;
      // Ensure data is an object with array values
      const safeDataRaw: { [k: string]: any[] } = {};
      if (data && typeof data === 'object') {
        Object.keys(data).forEach((key) => {
          safeDataRaw[key] = Array.isArray(data[key]) ? data[key] : [];
        });
      }

      // Map backend documents into frontend-friendly SearchResult objects
      const mapped: SearchResults = {};
      Object.keys(safeDataRaw).forEach((cat) => {
        mapped[cat] = safeDataRaw[cat].map((doc: any) => {
          const id = doc._id || doc.id || String(Math.random());
          // Determine title heuristics
          const title = doc.name || doc.title || (doc.firstName && doc.lastName ? `${doc.firstName} ${doc.lastName}` : doc.studentId) || doc.code || 'Untitled';
          // Subtitle heuristics
          const subtitle = doc.email || doc.description || doc.section || doc.subject || '';
          // Build sensible routes per category
          let route: string | undefined;
          if (cat === 'students') route = `/admin/students/${id}`;
          else if (cat === 'teachers') route = `/admin/teachers/${id}`;
          else if (cat === 'classes') route = `/admin/academic/classes/${id}`;
          else if (cat === 'subjects') route = `/admin/academic/subjects/${id}`;
          else if (cat === 'exams') route = `/admin/exams/${id}`;
          else if (cat === 'courses') route = `/admin/academic/programs/${id}`;
          else if (cat === 'books') route = `/admin/library/books/${id}`;
          else if (cat === 'staff') route = `/admin/hr/staff/${id}`;
          else if (cat === 'routes') route = `/admin/transport/routes/${id}`;

          const result: SearchResult = {
            id: String(id),
            category: cat,
            title,
            subtitle,
            route,
            photo: doc.avatar || doc.photo || doc.image || undefined,
          };
          return result;
        });
      });

      set({ results: mapped, isLoading: false });
    } catch (e) {
      console.error('Search error:', e);
      set({ results: {}, isLoading: false });
    }
  },
  selectNext: () => {
    const allResults = Object.values(get().results).flat();
    set({ selectedIndex: (get().selectedIndex + 1) % allResults.length });
  },
  selectPrevious: () => {
    const allResults = Object.values(get().results).flat();
    set({ selectedIndex: (get().selectedIndex - 1 + allResults.length) % allResults.length });
  },
  executeSelected: () => {
    const allResults = Object.values(get().results).flat();
    const selected = allResults[get().selectedIndex];
    if (selected && selected.route) {
      window.location.href = selected.route;
      get().addToRecent(get().query);
      set({ isOpen: false });
    }
  },
  addToRecent: (query) => {
    let recent = get().recentSearches.filter((q) => q !== query);
    recent.unshift(query);
    if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    }
    set({ recentSearches: recent });
  },
}));

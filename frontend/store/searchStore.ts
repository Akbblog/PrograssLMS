import { create } from 'zustand';
import Fuse from 'fuse.js';

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
  recentSearches: JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'),
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
      const params = new URLSearchParams({ q: query });
      if (get().activeCategory) params.append('categories', get().activeCategory);
      const res = await fetch(`/api/v1/search?${params}`);
      const data = await res.json();
      set({ results: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
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
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    set({ recentSearches: recent });
  },
}));

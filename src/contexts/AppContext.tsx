import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppState, EventItem, FavoriteEntry, MedicineItem, ThemeMode } from '../types';
import { defaultState, readStoredState, writeStoredState } from '../lib/storage';

interface AppContextValue {
  user: AppState['user'];
  theme: ThemeMode;
  searchTerm: string;
  favorites: FavoriteEntry[];
  events: EventItem[];
  medicines: MedicineItem[];
  setTheme: (mode: ThemeMode) => void;
  setSearchTerm: (term: string) => void;
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  addMedicine: (item: MedicineItem) => void;
  updateMedicine: (id: string, item: Partial<MedicineItem>) => void;
  deleteMedicine: (id: string) => void;
  toggleFavorite: (id: string, type: FavoriteEntry['type']) => void;
  signIn: () => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => readStoredState());

  useEffect(() => {
    writeStoredState(state);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const resolvedTheme = state.theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : state.theme;
      root.classList.toggle('dark', resolvedTheme === 'dark');
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [state.theme]);

  const value = useMemo<AppContextValue>(() => ({
    user: state.user,
    theme: state.theme,
    searchTerm: state.searchTerm,
    favorites: state.favorites,
    events: state.events,
    medicines: state.medicines,
    setTheme: (mode) => setState((current) => ({ ...current, theme: mode })),
    setSearchTerm: (term) => setState((current) => ({ ...current, searchTerm: term })),
    addEvent: (event) => setState((current) => ({ ...current, events: [event, ...current.events] })),
    updateEvent: (id, updated) => setState((current) => ({ ...current, events: current.events.map((event) => (event.id === id ? { ...event, ...updated } : event)) })),
    deleteEvent: (id) => setState((current) => ({ ...current, events: current.events.filter((event) => event.id !== id), favorites: current.favorites.filter((favorite) => !(favorite.id === id && favorite.type === 'event')) })),
    addMedicine: (item) => setState((current) => ({ ...current, medicines: [item, ...current.medicines] })),
    updateMedicine: (id, updated) => setState((current) => ({ ...current, medicines: current.medicines.map((item) => (item.id === id ? { ...item, ...updated } : item)) })),
    deleteMedicine: (id) => setState((current) => ({ ...current, medicines: current.medicines.filter((item) => item.id !== id), favorites: current.favorites.filter((favorite) => !(favorite.id === id && favorite.type === 'medicine')) })),
    toggleFavorite: (id, type) => setState((current) => {
      const exists = current.favorites.some((favorite) => favorite.id === id && favorite.type === type);
      return {
        ...current,
        favorites: exists ? current.favorites.filter((favorite) => !(favorite.id === id && favorite.type === type)) : [...current.favorites, { id, type }],
      };
    }),
    signIn: () => setState((current) => ({ ...current, user: { ...current.user, name: 'Alicia Morgan', email: 'alicia@example.com' } })),
    signOut: () => setState((current) => ({ ...current, user: { ...current.user, name: 'Guest Session', email: 'guest@lifeorganizer.app' } })),
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}

export const initialState = defaultState;

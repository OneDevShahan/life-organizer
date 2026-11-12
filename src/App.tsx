import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { Bell, CalendarDays, ChevronRight, Heart, LayoutDashboard, LogOut, Moon, Search, Settings, Sparkles, Stethoscope, SunMedium, UserCircle2, type LucideIcon } from 'lucide-react';
import { Toaster } from 'sonner';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { AuthPage } from './modules/auth/AuthPage';
import { moduleRegistry } from './data/modules';
import { DashboardPage } from './modules/dashboard/DashboardPage';
import { EventsPage } from './modules/events/EventsPage';
import { MedicinePage } from './modules/medicine/MedicinePage';
import { SearchPage } from './modules/search/SearchPage';
import { CalendarPage } from './modules/calendar/CalendarPage';
import { FavoritesPage } from './modules/favorites/FavoritesPage';
import { SettingsPage } from './modules/settings/SettingsPage';
import { ProfilePage } from './modules/profile/ProfilePage';

const moduleIcons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  events: Sparkles,
  medicine: Stethoscope,
  search: Search,
  calendar: CalendarDays,
  favorites: Heart,
  settings: Settings,
  profile: UserCircle2,
};

function AppShell() {
  const { user, authStatus, dataLoading, searchTerm, setSearchTerm, theme, setTheme, signOut } = useAppContext();

  if (authStatus === 'unconfigured' || authStatus === 'loading' || !user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white/85 px-4 py-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-500">Life Organizer</p>
              <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Personal OS</h1>
            </div>
            <div className="rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200">Pro</div>
          </div>

          <nav className="space-y-2">
            {moduleRegistry.map((module) => {
              const Icon = moduleIcons[module.id] ?? LayoutDashboard;
              return (
                <NavLink key={module.id} to={module.path} className={({ isActive }) => `flex items-center justify-between rounded-2xl border px-3 py-3 text-sm font-medium transition ${isActive ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-sm dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/80'}`}>
                  <span className="flex items-center gap-3">
                    <span className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"><Icon size={16} /></span>
                    <span>{module.label}</span>
                  </span>
                  <ChevronRight size={15} className="opacity-60" />
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/90">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white shadow-sm">{user.avatar}</div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
            </div>
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 md:max-w-lg">
                <Search size={18} className="text-slate-400" />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search memories, medicines, and events" className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200" aria-label="Global search" />
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button type="button" className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" aria-label="Notifications">
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </button>
                <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {theme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
                <button type="button" onClick={() => void signOut()} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 dark:bg-violet-600 dark:hover:bg-violet-500">
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            {dataLoading && (
              <div className="mb-5 rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-200" role="status">
                Syncing your data…
              </div>
            )}
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/medicine" element={<MedicinePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppShell />
        <Toaster position="top-right" richColors />
      </AppProvider>
    </HashRouter>
  );
}

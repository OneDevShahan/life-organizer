import { useEffect, useMemo, useRef, useState } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, ChevronRight, Heart, LayoutDashboard, LogOut, Menu, Moon, Search, Settings, Sparkles, Stethoscope, SunMedium, UserCircle2, X, type LucideIcon } from 'lucide-react';
import { toast, Toaster } from 'sonner';
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
import { getDueReminders, getLocalDateKey, getSentReminderKeys, saveSentReminderKeys } from './services/reminders';
import { resolveTheme } from './services/theme';

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
  const { user, authStatus, dataLoading, searchTerm, setSearchTerm, theme, setTheme, signOut, events, medicines } = useAppContext();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    () => 'Notification' in window ? window.Notification.permission : 'unsupported',
  );
  const sentReminderRef = useRef(new Set<string>());
  const mobileNavButtonRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const allUpcomingEvents = useMemo(
    () => events
      .filter((event) => event.date >= getLocalDateKey(new Date()))
      .sort((left, right) => left.date.localeCompare(right.date)),
    [events],
  );
  const upcomingEvents = allUpcomingEvents.slice(0, 4);
  const activeMedicines = useMemo(() => {
    const today = getLocalDateKey(new Date());
    return medicines.filter((medicine) => medicine.startDate <= today && medicine.endDate >= today);
  }, [medicines]);

  useEffect(() => {
    if (!user || !('Notification' in window)) {
      return;
    }

    const checkReminders = () => {
      if (window.Notification.permission !== 'granted') {
        return;
      }

      const now = new Date();
      const date = getLocalDateKey(now);
      const sent = getSentReminderKeys(window.localStorage, user.id, date);
      for (const reminder of getDueReminders(events, medicines, now)) {
        const memoryKey = `${date}:${reminder.key}`;
        if (sent.has(reminder.key) || sentReminderRef.current.has(memoryKey)) {
          continue;
        }

        try {
          sentReminderRef.current.add(memoryKey);
          new window.Notification(reminder.title, { body: reminder.detail, tag: reminder.key });
          sent.add(reminder.key);
          saveSentReminderKeys(window.localStorage, user.id, date, sent);
        } catch (error) {
          sentReminderRef.current.delete(memoryKey);
          toast.error(error instanceof Error ? error.message : 'Could not show this reminder.');
        }
      }
    };

    checkReminders();
    const intervalId = window.setInterval(checkReminders, 15_000);
    document.addEventListener('visibilitychange', checkReminders);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', checkReminders);
    };
  }, [events, medicines, user]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileNavOpen) {
          setMobileNavOpen(false);
          mobileNavButtonRef.current?.focus();
        }
        if (notificationsOpen) {
          setNotificationsOpen(false);
          notificationButtonRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen, notificationsOpen]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }

    try {
      const permission = await window.Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast.success('Browser reminders are enabled while the app is open.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not request notification permission.');
    }
  };

  if (authStatus === 'unconfigured' || authStatus === 'loading' || !user) {
    return <AuthPage />;
  }

  const resolvedTheme = resolveTheme(theme, window.matchMedia('(prefers-color-scheme: dark)').matches);
  const notificationCount = allUpcomingEvents.length + activeMedicines.length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
        className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-violet-700 px-4 py-3 font-semibold text-white focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-violet-500"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className={`border-b border-slate-200 bg-white/85 px-4 py-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 lg:min-h-screen lg:border-b-0 lg:border-r ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
          <div className="flex items-center justify-between gap-3 lg:mb-8">
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Life Organizer</p>
              <h1 className={`mt-1 text-xl font-bold text-slate-900 dark:text-white ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Personal OS</h1>
              {sidebarCollapsed && <Sparkles className="hidden text-violet-500 lg:block" size={22} aria-label="Life Organizer" />}
            </div>
            <div className={`rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Pro</div>
            <button ref={mobileNavButtonRef} type="button" onClick={() => setMobileNavOpen((open) => !open)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-200 lg:hidden" aria-label={mobileNavOpen ? 'Hide navigation' : 'Show navigation'} aria-expanded={mobileNavOpen} aria-controls="primary-navigation">
              {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <button type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:inline-flex" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!sidebarCollapsed}>
              <Menu size={19} />
            </button>
          </div>

          <nav id="primary-navigation" aria-label="Primary navigation" className={`${mobileNavOpen ? 'mt-6 block' : 'hidden'} space-y-2 lg:mt-0 lg:block`}>
            {moduleRegistry.map((module) => {
              const Icon = moduleIcons[module.id] ?? LayoutDashboard;
              return (
                <NavLink key={module.id} to={module.path} title={sidebarCollapsed ? module.label : undefined} aria-label={sidebarCollapsed ? module.label : undefined} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `flex items-center justify-between rounded-2xl border px-3 py-3 text-sm font-medium transition ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''} ${isActive ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-sm dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/80'}`}>
                  <span className="flex items-center gap-3">
                    <span className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"><Icon size={16} /></span>
                    <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{module.label}</span>
                  </span>
                  <ChevronRight size={15} className={`opacity-60 ${sidebarCollapsed ? 'lg:hidden' : ''}`} />
                </NavLink>
              );
            })}
          </nav>

          <div className={`${mobileNavOpen ? 'mt-6 block' : 'hidden'} rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/90 lg:mt-6 lg:block ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold text-white shadow-sm">{user.avatar}</div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
              </div>
            </div>
            <button type="button" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {resolvedTheme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
              {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
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
                <div className="relative">
                  <button ref={notificationButtonRef} type="button" onClick={() => setNotificationsOpen((open) => !open)} className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" aria-label={`Upcoming items${notificationCount ? `, ${notificationCount}` : ''}`} aria-expanded={notificationsOpen} aria-controls="upcoming-panel">
                    <Bell size={18} />
                    {notificationCount > 0 && <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">{notificationCount}</span>}
                  </button>
                  {notificationsOpen && (
                    <section id="upcoming-panel" className="absolute right-0 z-30 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900" aria-label="Upcoming items" aria-live="polite">
                      <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Coming up</h2>
                        <button type="button" onClick={() => setNotificationsOpen(false)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close upcoming items"><X size={16} /></button>
                      </div>
                      <p className="mb-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Desktop alerts work only while this app is open. Medicine alerts use one daily reminder time and are not a substitute for medical advice.
                      </p>
                      {notificationPermission === 'default' && (
                        <button type="button" onClick={() => void enableNotifications()} className="mb-3 w-full rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">
                          Enable desktop alerts
                        </button>
                      )}
                      {notificationPermission === 'denied' && <p className="mb-3 text-xs text-amber-700 dark:text-amber-300">Notifications are blocked by your browser. Allow them in site settings to receive desktop alerts.</p>}
                      {notificationPermission === 'unsupported' && <p className="mb-3 text-xs text-amber-700 dark:text-amber-300">This browser does not support desktop notifications.</p>}
                      <div className="max-h-80 space-y-2 overflow-y-auto">
                        {upcomingEvents.map((event) => (
                          <button key={event.id} type="button" onClick={() => { navigate('/events'); setNotificationsOpen(false); }} className="block w-full rounded-xl bg-violet-50 p-3 text-left hover:bg-violet-100 dark:bg-violet-500/10 dark:hover:bg-violet-500/20">
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">{event.title}</span>
                            <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{event.date}{event.time ? ` · ${event.time}` : ''}</span>
                          </button>
                        ))}
                        {activeMedicines.slice(0, 4).map((medicine) => (
                          <button key={medicine.id} type="button" onClick={() => { navigate('/medicine'); setNotificationsOpen(false); }} className="block w-full rounded-xl bg-emerald-50 p-3 text-left hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20">
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">{medicine.name}</span>
                            <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">Medicine reminder · {medicine.reminderTime || medicine.frequency}</span>
                          </button>
                        ))}
                        {notificationCount === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">Nothing coming up yet. Add an event or medicine reminder to see it here.</p>}
                      </div>
                    </section>
                  )}
                </div>
                <button type="button" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {resolvedTheme === 'dark' ? <SunMedium size={16} /> : <Moon size={16} />}
                  {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
                </button>
                <button type="button" onClick={() => void signOut()} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 dark:bg-violet-600 dark:hover:bg-violet-500">
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          </header>

          <main id="main-content" tabIndex={-1} className="p-4 outline-none focus-visible:outline-2 focus-visible:outline-violet-500 sm:p-6 lg:p-8">
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

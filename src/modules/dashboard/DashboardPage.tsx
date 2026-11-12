import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Activity, CalendarRange, Heart, Pill, Sparkles } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function DashboardPage() {
  const { user, events, medicines, favorites } = useAppContext();
  const stats = [
    { label: 'Events', value: String(events.length), icon: CalendarRange, tone: 'violet' },
    { label: 'Medicines', value: String(medicines.length), icon: Pill, tone: 'emerald' },
    { label: 'Favorites', value: String(favorites.length), icon: Heart, tone: 'rose' },
    { label: 'Wellbeing', value: '92%', icon: Activity, tone: 'sky' },
  ];

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-500">Welcome back</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Your life dashboard is ready. Keep track of memories, medicine routines, reminders, and favorite highlights in one place.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 px-5 py-4 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">Today</p>
            <p className="mt-2 text-3xl font-bold">{format(new Date(), 'MMM d')}</p>
            <p className="text-sm text-violet-100">{events.length} moments tracked</p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className={`mb-4 inline-flex rounded-2xl p-2 ${tone === 'violet' ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300' : tone === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' : tone === 'rose' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300' : 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300'}`}>
              <Icon size={18} />
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><Sparkles size={18} /></div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming moments</h3>
          </div>
          <div className="space-y-3">
            {events.length ? events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{event.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{event.date} · {event.location}</p>
                </div>
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">{event.category}</span>
              </div>
            )) : <p className="text-sm text-slate-500 dark:text-slate-300">No upcoming moments yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><Pill size={18} /></div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Daily reminders</h3>
          </div>
          <div className="space-y-3">
            {medicines.length ? medicines.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">{item.category}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.frequency} · {item.reminderTime}</p>
              </div>
            )) : <p className="text-sm text-slate-500 dark:text-slate-300">No medicine reminders scheduled.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

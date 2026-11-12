import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';

export function CalendarPage() {
  const { events } = useAppContext();
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const groupedEvents = useMemo(() => events.reduce<Record<string, typeof events>>((acc, item) => {
    const key = item.date;
    acc[key] = acc[key] ? [...acc[key], item] : [item];
    return acc;
  }, {}), [events]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-500">Planning</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Calendar</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">{format(monthStart, 'MMMM yyyy')}</div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <div key={day}>{day}</div>)}</div>
        <div className="grid grid-cols-7 gap-2">{calendarDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const items = groupedEvents[dayKey] ?? [];
          const isCurrentMonth = isSameMonth(day, monthStart);
          return (
            <div key={dayKey} className={`min-h-[130px] rounded-2xl border p-2 ${isCurrentMonth ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60' : 'border-slate-100 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60'}`}>
              <div className={`mb-2 text-right text-sm font-medium ${isCurrentMonth ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}`}>{format(day, 'd')}</div>
              <div className="space-y-1.5">{items.slice(0, 2).map((item) => <div key={item.id} className={`rounded-lg px-2 py-1 text-[11px] font-medium ${item.category === 'appointment' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200' : item.category === 'memory' ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200' : 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200'}`}>{item.title}</div>)}{items.length > 2 && <div className="text-[10px] text-slate-500 dark:text-slate-400">+{items.length - 2} more</div>}</div>
            </div>
          );
        })}</div>
      </div>
    </div>
  );
}

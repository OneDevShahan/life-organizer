import { Search, Sparkles } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function SearchPage() {
  const { searchTerm, events, medicines, favorites } = useAppContext();
  const normalized = searchTerm.trim().toLowerCase();
  const filteredEvents = normalized ? events.filter((event) => [event.title, event.location, event.notes, event.mood, event.category].join(' ').toLowerCase().includes(normalized)) : events;
  const filteredMedicines = normalized ? medicines.filter((item) => [item.name, item.dosage, item.frequency, item.notes, item.category].join(' ').toLowerCase().includes(normalized)) : medicines;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">System</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Global Search</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-200"><Search size={16} /> {filteredEvents.length + filteredMedicines.length} matches</div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800">
          <Search size={18} className="text-slate-400" />
          <input value={searchTerm} readOnly aria-label="Search summary" className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200" placeholder="Search is available in the header" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><Sparkles size={18} /></div><h3 className="text-lg font-semibold text-slate-900 dark:text-white">Events</h3></div>
          {filteredEvents.length ? <div className="space-y-3">{filteredEvents.map((event) => <div key={event.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80"><div className="flex items-center justify-between gap-3"><div><p className="font-medium text-slate-900 dark:text-white">{event.title}</p><p className="text-sm text-slate-500 dark:text-slate-400">{event.location}</p></div><span className="rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">{event.category}</span></div></div>)}</div> : <p className="text-sm text-slate-500 dark:text-slate-300">No matching events found.</p>}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><Search size={18} /></div><h3 className="text-lg font-semibold text-slate-900 dark:text-white">Medicines</h3></div>
          {filteredMedicines.length ? <div className="space-y-3">{filteredMedicines.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80"><div className="flex items-center justify-between gap-3"><div><p className="font-medium text-slate-900 dark:text-white">{item.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{item.dosage}</p></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">{item.category}</span></div></div>)}</div> : <p className="text-sm text-slate-500 dark:text-slate-300">No matching medicines found.</p>}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Favorites tracked: {favorites.length}</div>
    </div>
  );
}

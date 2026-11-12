import { Heart, Sparkles } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function FavoritesPage() {
  const { events, medicines, favorites } = useAppContext();
  const favoriteEvents = favorites.filter((favorite) => favorite.type === 'event').map((favorite) => events.find((event) => event.id === favorite.id)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const favoriteMedicines = favorites.filter((favorite) => favorite.type === 'medicine').map((favorite) => medicines.find((item) => item.id === favorite.id)).filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-500">Highlights</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Favorites</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-200"><Heart size={16} /> {favorites.length} pinned items</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><Sparkles size={18} /></div><h3 className="text-lg font-semibold text-slate-900 dark:text-white">Favorite events</h3></div>
          {favoriteEvents.length ? <div className="space-y-3">{favoriteEvents.map((event) => <div key={event.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80"><p className="font-medium text-slate-900 dark:text-white">{event.title}</p><p className="text-sm text-slate-500 dark:text-slate-400">{event.date} · {event.location}</p></div>)}</div> : <p className="text-sm text-slate-500 dark:text-slate-300">No favorite events yet.</p>}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3"><div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><Heart size={18} /></div><h3 className="text-lg font-semibold text-slate-900 dark:text-white">Favorite medicines</h3></div>
          {favoriteMedicines.length ? <div className="space-y-3">{favoriteMedicines.map((item) => <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/80"><p className="font-medium text-slate-900 dark:text-white">{item.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{item.dosage} · {item.frequency}</p></div>)}</div> : <p className="text-sm text-slate-500 dark:text-slate-300">No favorite medicines yet.</p>}
        </div>
      </div>
    </div>
  );
}

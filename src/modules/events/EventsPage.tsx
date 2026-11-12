import { format } from 'date-fns';
import { motion } from 'motion/react';
import { BookOpenText, CalendarRange, PlusCircle, Star, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../../contexts/AppContext';
import { eventFormSchema, type EventFormValues } from './eventSchema';

export function EventsPage() {
  const { events, favorites, addEvent, deleteEvent, toggleFavorite } = useAppContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { title: '', date: '', time: '09:00', category: 'event', location: '', notes: '', mood: '' },
  });

  const onSubmit = async (values: EventFormValues) => {
    const saved = await addEvent({ id: crypto.randomUUID(), ...values });
    if (saved) {
      reset();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-500">Module</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Events & Memories</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-200"><CalendarRange size={16} /> {events.length} captured moments</div>
      </div>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.1fr_1.6fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-violet-50 p-2 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><PlusCircle size={18} /></div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add a memory</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</span><input {...register('title')} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'event-title-error' : undefined} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.title && <span id="event-title-error" role="alert" className="text-xs text-rose-500">{errors.title.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</span><input type="date" {...register('date')} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'event-date-error' : undefined} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.date && <span id="event-date-error" role="alert" className="text-xs text-rose-500">{errors.date.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time</span><input type="time" {...register('time')} aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? 'event-time-error' : undefined} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.time && <span id="event-time-error" role="alert" className="text-xs text-rose-500">{errors.time.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</span><select {...register('category')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option value="memory">Memory</option><option value="event">Event</option><option value="appointment">Appointment</option></select></label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mood</span><input {...register('mood')} aria-invalid={Boolean(errors.mood)} aria-describedby={errors.mood ? 'event-mood-error' : undefined} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.mood && <span id="event-mood-error" role="alert" className="text-xs text-rose-500">{errors.mood.message}</span>}</label>
            <label className="space-y-1.5 sm:col-span-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</span><input {...register('location')} aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? 'event-location-error' : undefined} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.location && <span id="event-location-error" role="alert" className="text-xs text-rose-500">{errors.location.message}</span>}</label>
            <label className="space-y-1.5 sm:col-span-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span><textarea rows={4} {...register('notes')} aria-invalid={Boolean(errors.notes)} aria-describedby={errors.notes ? 'event-notes-error' : undefined} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.notes && <span id="event-notes-error" role="alert" className="text-xs text-rose-500">{errors.notes.message}</span>}</label>
          </div>

          <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"><PlusCircle size={16} /> Save memory</button>
        </form>

        <div className="space-y-4">
          {events.length ? events.map((event) => {
            const isFavorite = favorites.some((item) => item.id === event.id && item.type === 'event');
            return (
              <motion.article key={event.id} layout className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-violet-500"><BookOpenText size={14} /> {event.category}</div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                  </div>
                  <button type="button" onClick={() => toggleFavorite(event.id, 'event')} aria-label={`Toggle ${event.title} favorite`} className={`${isFavorite ? 'text-amber-400' : 'text-slate-300'} flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800`}><Star size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                  <div><span className="font-medium text-slate-900 dark:text-white">Date:</span> {format(new Date(`${event.date}T${event.time}`), 'MMM d, yyyy')}</div>
                  <div><span className="font-medium text-slate-900 dark:text-white">Time:</span> {event.time}</div>
                  <div className="sm:col-span-2"><span className="font-medium text-slate-900 dark:text-white">Location:</span> {event.location}</div>
                  <div className="sm:col-span-2"><span className="font-medium text-slate-900 dark:text-white">Mood:</span> {event.mood}</div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.notes}</p>
                <div className="mt-5 flex items-center justify-end"><button type="button" onClick={() => deleteEvent(event.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"><Trash2 size={15} /> Remove</button></div>
              </motion.article>
            );
          }) : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">You have not added any memories yet. Capture one to get started.</div>}
        </div>
      </motion.section>
    </div>
  );
}

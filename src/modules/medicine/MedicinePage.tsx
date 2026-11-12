import { motion } from 'motion/react';
import { Heart, Pill, PlusCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../../contexts/AppContext';
import { medicineFormSchema, type MedicineFormValues } from './medicineSchema';

export function MedicinePage() {
  const { medicines, favorites, addMedicine, deleteMedicine, toggleFavorite } = useAppContext();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: { name: '', dosage: '', frequency: 'Daily', reminderTime: '08:00', startDate: '', endDate: '', notes: '', category: 'supplement' },
  });

  const onSubmit = (values: MedicineFormValues) => {
    addMedicine({ id: crypto.randomUUID(), ...values, favorite: false });
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-500">Module</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Medicine Library</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200"><Pill size={16} /> {medicines.length} tracked items</div>
      </div>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1fr_1.65fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><PlusCircle size={18} /></div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add medication</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span><input {...register('name')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dosage</span><input {...register('dosage')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.dosage && <span className="text-xs text-rose-500">{errors.dosage.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Frequency</span><input {...register('frequency')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.frequency && <span className="text-xs text-rose-500">{errors.frequency.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Reminder</span><input type="time" {...register('reminderTime')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.reminderTime && <span className="text-xs text-rose-500">{errors.reminderTime.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start date</span><input type="date" {...register('startDate')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.startDate && <span className="text-xs text-rose-500">{errors.startDate.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">End date</span><input type="date" {...register('endDate')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.endDate && <span className="text-xs text-rose-500">{errors.endDate.message}</span>}</label>
            <label className="space-y-1.5"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</span><select {...register('category')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"><option value="prescription">Prescription</option><option value="supplement">Supplement</option><option value="vitamin">Vitamin</option></select></label>
            <label className="space-y-1.5 sm:col-span-2"><span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</span><textarea rows={4} {...register('notes')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />{errors.notes && <span className="text-xs text-rose-500">{errors.notes.message}</span>}</label>
          </div>

          <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"><PlusCircle size={16} /> Save medicine</button>
        </form>

        <div className="space-y-4">
          {medicines.length ? medicines.map((item) => {
            const isFavorite = favorites.some((favorite) => favorite.id === item.id && favorite.type === 'medicine');
            return (
              <motion.article key={item.id} layout className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-500"><Pill size={14} /> {item.category}</div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item.name}</h3>
                  </div>
                  <button type="button" onClick={() => toggleFavorite(item.id, 'medicine')} aria-label={`Toggle ${item.name} favorite`} className={`${isFavorite ? 'text-amber-400' : 'text-slate-300'} flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800`}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} /></button>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                  <div><span className="font-medium text-slate-900 dark:text-white">Dosage:</span> {item.dosage}</div>
                  <div><span className="font-medium text-slate-900 dark:text-white">Frequency:</span> {item.frequency}</div>
                  <div><span className="font-medium text-slate-900 dark:text-white">Reminder:</span> {item.reminderTime}</div>
                  <div><span className="font-medium text-slate-900 dark:text-white">Dates:</span> {item.startDate} → {item.endDate}</div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.notes}</p>
                <div className="mt-5 flex items-center justify-end"><button type="button" onClick={() => deleteMedicine(item.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"><Trash2 size={15} /> Remove</button></div>
              </motion.article>
            );
          }) : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">No medicines tracked yet. Add your personal library.</div>}
        </div>
      </motion.section>
    </div>
  );
}

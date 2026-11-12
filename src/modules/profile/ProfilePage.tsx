import { ShieldCheck, UserCircle2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function ProfilePage() {
  const { user } = useAppContext();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Account</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">User Profile</h2>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 text-xl font-bold text-white shadow-lg">{user.avatar}</div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-800 dark:text-slate-200"><ShieldCheck size={14} /> {user.role}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"><UserCircle2 size={16} /> Profile summary</div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">You are synced to {user.timezone} and actively managing memories, routines, and health events in one central dashboard.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"><ShieldCheck size={16} /> Security status</div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">You are signed in with Firebase Authentication. Firestore access is isolated by user ID; publish the repository security rules before using real personal data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Moon, Sparkles, SunMedium } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export function SettingsPage() {
  const { theme, setTheme } = useAppContext();
  const options = [
    { id: 'light', label: 'Light', icon: SunMedium },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Sparkles },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-500">Preferences</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Settings</h2>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Theme manager</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.id;
            return (
              <button key={option.id} type="button" onClick={() => setTheme(option.id)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${isActive ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-200' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                <span className="inline-flex items-center gap-2"><Icon size={16} /> {option.label}</span>
                {isActive && <span className="text-xs font-bold">ON</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

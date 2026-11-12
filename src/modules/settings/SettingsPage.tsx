import { useRef, useState, type ChangeEvent } from 'react';
import { Download, Moon, ShieldAlert, Sparkles, SunMedium, Upload } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { createBackup, parseBackup, serializeBackup } from '../../services/backup';

export function SettingsPage() {
  const { theme, setTheme, events, medicines, favorites, restoreBackup } = useAppContext();
  const backupInput = useRef<HTMLInputElement>(null);
  const [backupStatus, setBackupStatus] = useState('');
  const [backupError, setBackupError] = useState('');
  const [importing, setImporting] = useState(false);
  const options = [
    { id: 'light', label: 'Light', icon: SunMedium },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Sparkles },
  ] as const;

  const exportData = () => {
    const backup = createBackup({ events, medicines, favorites, theme });
    const file = new Blob([serializeBackup(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-organizer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupError('');
    setBackupStatus('Backup downloaded. Store it somewhere private and secure.');
  };

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setBackupError('');
    setBackupStatus('');
    setImporting(true);
    try {
      const backup = parseBackup(await file.text());
      const recordCount = backup.events.length + backup.medicines.length + backup.favorites.length;
      if (!window.confirm(`Import ${recordCount} records? Existing records with matching IDs will be updated. Other data will be kept.`)) {
        return;
      }

      const restored = await restoreBackup(backup);
      if (restored) {
        setBackupStatus(`Imported ${recordCount} records. Existing matching IDs were updated; other records were kept.`);
      } else {
        setBackupError('The backup could not be fully restored. Check the error notification and try again.');
      }
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : 'Could not read this backup file.');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

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

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-labelledby="data-backup-heading">
        <h3 id="data-backup-heading" className="text-lg font-semibold text-slate-900 dark:text-white">Your data</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Download a private JSON backup or restore one. Import adds records and updates matching IDs; it never deletes records that are not in the file.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={exportData} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500">
            <Download size={16} aria-hidden="true" /> Export backup
          </button>
          <button type="button" onClick={() => backupInput.current?.click()} disabled={importing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500">
            <Upload size={16} aria-hidden="true" /> {importing ? 'Restoring…' : 'Import backup'}
          </button>
          <input ref={backupInput} type="file" accept="application/json,.json" onChange={(event) => void importData(event)} className="sr-only" aria-label="Choose a Life Organizer JSON backup" />
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-amber-700 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 shrink-0" size={15} aria-hidden="true" />
          Backups contain personal and medicine information. Keep them private and do not rely on this app or notifications for urgent or safety-critical medical decisions.
        </p>
        {backupStatus && <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300" role="status">{backupStatus}</p>}
        {backupError && <p className="mt-3 text-sm text-rose-700 dark:text-rose-300" role="alert">{backupError}</p>}
      </section>
    </div>
  );
}

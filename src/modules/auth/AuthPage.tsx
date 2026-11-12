import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe2, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAppContext } from '../../contexts/AppContext';

const authSchema = z.object({
  name: z.string().trim(),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type AuthValues = z.infer<typeof authSchema>;

export function AuthPage() {
  const {
    authStatus,
    authError,
    googleLinkEmail,
    signIn,
    signInWithGoogle,
    completeGoogleLink,
    cancelGoogleLink,
    signUp,
  } = useAppContext();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [submitting, setSubmitting] = useState(false);
  const [linkPassword, setLinkPassword] = useState('');
  const validationSchema = useMemo(
    () => authSchema.superRefine((values, context) => {
      if (mode === 'sign-up' && values.name.length < 2) {
        context.addIssue({ code: 'custom', path: ['name'], message: 'Enter your name.' });
      }
    }),
    [mode],
  );
  const { register, handleSubmit, formState: { errors } } = useForm<AuthValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: AuthValues) => {
    setSubmitting(true);
    const success = mode === 'sign-up'
      ? await signUp(values.name, values.email, values.password)
      : await signIn(values.email, values.password);
    setSubmitting(false);

    if (success) {
      window.location.hash = '#/';
    }
  };

  const onGoogleSignIn = async () => {
    setSubmitting(true);
    const success = await signInWithGoogle();
    setSubmitting(false);

    if (success) {
      window.location.hash = '#/';
    }
  };

  const onCompleteGoogleLink = async () => {
    setSubmitting(true);
    const success = await completeGoogleLink(linkPassword);
    setSubmitting(false);

    if (success) {
      window.location.hash = '#/';
    }
  };

  const unconfigured = authStatus === 'unconfigured';

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">Life Organizer</p>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Your personal space</h1>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {unconfigured ? 'Firebase setup needed' : mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {unconfigured
            ? 'Add the Firebase web app settings to enable secure sign-in and cloud sync.'
            : mode === 'sign-in'
              ? 'Sign in to sync your events and medicine library across devices.'
              : 'Create an account to start your private, synced workspace.'}
        </p>

        {unconfigured ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
            Configure the <code>VITE_FIREBASE_*</code> values in <code>.env.local</code>. For GitHub Pages, add the same values as repository Actions variables.
          </div>
        ) : authStatus === 'loading' ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300" role="status">
            Connecting to Firebase…
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {googleLinkEmail ? (
              <div className="space-y-4">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  An account already exists for <strong>{googleLinkEmail}</strong>. Sign in with its password to securely connect Google to that same account.
                </p>
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Existing account password</span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={linkPassword}
                    onChange={(event) => setLinkPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
                {authError && (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200" role="alert">
                    {authError}
                  </p>
                )}
                <button type="button" onClick={onCompleteGoogleLink} disabled={submitting || !linkPassword} className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-60">
                  {submitting ? 'Please wait…' : 'Verify and connect Google'}
                </button>
                <button type="button" onClick={() => { cancelGoogleLink(); setLinkPassword(''); }} disabled={submitting} className="w-full rounded-2xl px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50 disabled:opacity-60 dark:text-violet-300 dark:hover:bg-violet-500/10">
                  Cancel
                </button>
              </div>
            ) : (
              <>
            {mode === 'sign-up' && (
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</span>
                <input autoComplete="name" {...register('name')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                {errors.name && <span className="text-xs text-rose-500">{errors.name.message}</span>}
              </label>
            )}

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input type="email" autoComplete="email" {...register('email')} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </span>
              {errors.email && <span className="text-xs text-rose-500">{errors.email.message}</span>}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
              <span className="relative block">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input type="password" autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} {...register('password')} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 outline-none focus:border-violet-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </span>
              {errors.password && <span className="text-xs text-rose-500">{errors.password.message}</span>}
            </label>

            {authError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200" role="alert">
                {authError}
              </p>
            )}

            <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-60">
              {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
            </button>
            <div className="flex items-center gap-3 text-xs text-slate-400" aria-hidden="true">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              or
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            <button type="button" onClick={onGoogleSignIn} disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              <Globe2 size={18} aria-hidden="true" />
              Continue with Google
            </button>
            <button type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')} className="w-full rounded-2xl px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-500/10">
              {mode === 'sign-in' ? 'New here? Create an account' : 'Already have an account? Sign in'}
            </button>
              </>
            )}
          </form>
        )}
      </section>
    </main>
  );
}

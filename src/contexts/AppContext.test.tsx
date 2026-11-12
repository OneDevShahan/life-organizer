import { fireEvent, render, screen } from '@testing-library/react';
import { FirebaseError } from 'firebase/app';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppProvider, useAppContext } from './AppContext';
import { signInWithEmailAndPassword } from 'firebase/auth';

vi.mock('../services/firebase', () => ({ firebaseAuth: { name: 'test-auth' }, firebaseReady: true }));
vi.mock('../services/userData', () => ({
  removeEvent: vi.fn(),
  removeFavorite: vi.fn(),
  removeMedicine: vi.fn(),
  restoreUserData: vi.fn(),
  saveEvent: vi.fn(),
  saveFavorite: vi.fn(),
  saveMedicine: vi.fn(),
  saveTheme: vi.fn(),
  subscribeEvents: vi.fn(() => () => undefined),
  subscribeFavorites: vi.fn(() => () => undefined),
  subscribeMedicines: vi.fn(() => () => undefined),
  subscribeTheme: vi.fn(() => () => undefined),
}));
vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual,
    onAuthStateChanged: vi.fn(() => () => undefined),
    signInWithEmailAndPassword: vi.fn(),
  };
});

function AuthProbe() {
  const { authError, signIn } = useAppContext();
  return (
    <>
      <button type="button" onClick={() => void signIn('person@example.com', 'password123')}>Sign in test</button>
      {authError && <p role="alert">{authError}</p>}
    </>
  );
}

describe('Firebase authentication actions', () => {
  beforeEach(() => {
    vi.mocked(signInWithEmailAndPassword).mockReset();
  });

  it('surfaces Firebase credential errors instead of failing silently', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new FirebaseError('auth/wrong-password', 'wrong password'),
    );
    render(
      <AppProvider>
        <AuthProbe />
      </AppProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign in test' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('The email or password is incorrect.');
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      { name: 'test-auth' },
      'person@example.com',
      'password123',
    );
  });
});

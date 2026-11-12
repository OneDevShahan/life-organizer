import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { useAppContext } from './contexts/AppContext';

vi.mock('./contexts/AppContext', () => ({
  AppProvider: ({ children }: { children: ReactNode }) => children,
  useAppContext: vi.fn(),
}));

function createContextValue(authStatus: 'loading' | 'signed-in'): ReturnType<typeof useAppContext> {
  return {
    user: authStatus === 'signed-in'
      ? { id: 'user-1', name: 'Alex', email: 'alex@example.com', role: 'Member', timezone: 'UTC', avatar: 'A' }
      : null,
    authStatus,
    authError: null,
    googleLinkEmail: null,
    dataLoading: false,
    theme: 'light',
    searchTerm: '',
    favorites: [],
    events: [],
    medicines: [],
    setTheme: vi.fn(),
    setSearchTerm: vi.fn(),
    signIn: vi.fn(),
    signInWithGoogle: vi.fn(),
    completeGoogleLink: vi.fn(),
    cancelGoogleLink: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    restoreBackup: vi.fn(),
    addEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
    addMedicine: vi.fn(),
    updateMedicine: vi.fn(),
    deleteMedicine: vi.fn(),
    toggleFavorite: vi.fn(),
  };
}

describe('application shell accessibility', () => {
  beforeEach(() => {
    window.location.hash = '#/';
  });

  it('keeps the hook order when authentication changes from loading to signed in', () => {
    vi.mocked(useAppContext).mockReturnValue(createContextValue('loading'));
    const app = render(<App />);

    vi.mocked(useAppContext).mockReturnValue(createContextValue('signed-in'));
    app.rerender(<App />);

    expect(screen.getByRole('heading', { name: 'Alex' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toBeInTheDocument();
  });

  it('allows the mobile navigation to be toggled with an accessible control', () => {
    vi.mocked(useAppContext).mockReturnValue(createContextValue('signed-in'));
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Show navigation' }));

    expect(screen.getByRole('button', { name: 'Hide navigation' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Primary navigation' }).className).toContain('block');
  });

  it('collapses desktop navigation without removing accessible link names', () => {
    vi.mocked(useAppContext).mockReturnValue(createContextValue('signed-in'));
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });
});

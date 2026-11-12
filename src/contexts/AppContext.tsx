import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { toast } from 'sonner';
import type {
  EventItem,
  FavoriteEntry,
  MedicineItem,
  ThemeMode,
  UserProfile,
} from '../types';
import { firebaseAuth, firebaseReady } from '../services/firebase';
import {
  removeEvent,
  removeFavorite,
  removeMedicine,
  saveEvent,
  saveFavorite,
  saveMedicine,
  saveTheme,
  subscribeEvents,
  subscribeFavorites,
  subscribeMedicines,
  subscribeTheme,
} from '../services/userData';

type AuthStatus = 'loading' | 'signed-in' | 'signed-out' | 'unconfigured';

interface AppContextValue {
  user: UserProfile | null;
  authStatus: AuthStatus;
  authError: string | null;
  dataLoading: boolean;
  theme: ThemeMode;
  searchTerm: string;
  favorites: FavoriteEntry[];
  events: EventItem[];
  medicines: MedicineItem[];
  setTheme: (mode: ThemeMode) => void;
  setSearchTerm: (term: string) => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  addEvent: (event: EventItem) => Promise<boolean>;
  updateEvent: (id: string, event: Partial<EventItem>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  addMedicine: (item: MedicineItem) => Promise<boolean>;
  updateMedicine: (id: string, item: Partial<MedicineItem>) => Promise<boolean>;
  deleteMedicine: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string, type: FavoriteEntry['type']) => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getProfile(user: User): UserProfile {
  const name = user.displayName || user.email?.split('@')[0] || 'Life Organizer member';
  return {
    id: user.uid,
    name,
    email: user.email ?? '',
    role: 'Member',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    avatar: name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join(''),
  };
}

function getErrorMessage(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error
    ? String(error.code)
    : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email.';
    case 'auth/weak-password':
      return 'Use a password with at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Firestore denied this request. Check that the published rules allow this signed-in user.';
    default:
      return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(firebaseReady ? 'loading' : 'unconfigured');
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthStatus('unconfigured');
      return;
    }

    return onAuthStateChanged(
      firebaseAuth,
      (user) => {
        setFirebaseUser(user);
        setAuthStatus(user ? 'signed-in' : 'signed-out');
        setAuthError(null);
      },
      (error) => {
        setAuthError(getErrorMessage(error));
        setAuthStatus('signed-out');
      },
    );
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const resolvedTheme = theme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : theme;
      root.classList.toggle('dark', resolvedTheme === 'dark');
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  useEffect(() => {
    if (!firebaseUser) {
      setEvents([]);
      setMedicines([]);
      setFavorites([]);
      setThemeState('system');
      setDataLoading(false);
      return;
    }

    setDataLoading(true);
    const settled = new Set<string>();
    const markSettled = (key: string) => {
      settled.add(key);
      if (settled.size === 4) {
        setDataLoading(false);
      }
    };
    const handleSnapshotError = (error: Error) => {
      toast.error(getErrorMessage(error));
      setDataLoading(false);
    };

    const unsubscribers = [
      subscribeEvents(firebaseUser.uid, (items) => {
        setEvents(items);
        markSettled('events');
      }, handleSnapshotError),
      subscribeMedicines(firebaseUser.uid, (items) => {
        setMedicines(items);
        markSettled('medicines');
      }, handleSnapshotError),
      subscribeFavorites(firebaseUser.uid, (items) => {
        setFavorites(items);
        markSettled('favorites');
      }, handleSnapshotError),
      subscribeTheme(firebaseUser.uid, (value) => {
        if (value) {
          setThemeState(value);
        }
        markSettled('settings');
      }, (error) => {
        handleSnapshotError(error);
        markSettled('settings');
      }),
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [firebaseUser]);

  const runAuthAction = useCallback(async (action: () => Promise<unknown>) => {
    setAuthError(null);
    try {
      await action();
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      setAuthError(message);
      toast.error(message);
      return false;
    }
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const auth = firebaseAuth;
    if (!auth) {
      setAuthError('Firebase is not configured. Add the Firebase web app settings first.');
      return Promise.resolve(false);
    }

    return runAuthAction(() => signInWithEmailAndPassword(auth, email, password));
  }, [runAuthAction]);

  const signUp = useCallback((name: string, email: string, password: string) => {
    const auth = firebaseAuth;
    if (!auth) {
      setAuthError('Firebase is not configured. Add the Firebase web app settings first.');
      return Promise.resolve(false);
    }

    return runAuthAction(async () => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      setFirebaseUser(credential.user);
    });
  }, [runAuthAction]);

  const signOut = useCallback(() => {
    const auth = firebaseAuth;
    if (!auth) {
      return Promise.resolve(false);
    }
    return runAuthAction(() => firebaseSignOut(auth));
  }, [runAuthAction]);

  const runDataAction = useCallback(async (action: (uid: string) => Promise<unknown>) => {
    if (!firebaseUser) {
      toast.error('Sign in before saving your changes.');
      return false;
    }

    try {
      await action(firebaseUser.uid);
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    }
  }, [firebaseUser]);

  const value = useMemo<AppContextValue>(() => ({
    user: firebaseUser ? getProfile(firebaseUser) : null,
    authStatus,
    authError,
    dataLoading,
    theme,
    searchTerm,
    favorites,
    events,
    medicines,
    setTheme: (mode) => {
      setThemeState(mode);
      if (firebaseUser) {
        void runDataAction((uid) => saveTheme(uid, mode));
      }
    },
    setSearchTerm,
    signIn,
    signUp,
    signOut,
    addEvent: (event) => runDataAction((uid) => saveEvent(uid, event)),
    updateEvent: (id, updated) => {
      const existing = events.find((event) => event.id === id);
      return existing
        ? runDataAction((uid) => saveEvent(uid, { ...existing, ...updated }))
        : Promise.resolve(false);
    },
    deleteEvent: (id) => runDataAction(async (uid) => {
      await removeEvent(uid, id);
      await removeFavorite(uid, { id, type: 'event' });
    }),
    addMedicine: (item) => runDataAction((uid) => saveMedicine(uid, item)),
    updateMedicine: (id, updated) => {
      const existing = medicines.find((item) => item.id === id);
      return existing
        ? runDataAction((uid) => saveMedicine(uid, { ...existing, ...updated }))
        : Promise.resolve(false);
    },
    deleteMedicine: (id) => runDataAction(async (uid) => {
      await removeMedicine(uid, id);
      await removeFavorite(uid, { id, type: 'medicine' });
    }),
    toggleFavorite: (id, type) => {
      const favorite = { id, type };
      return favorites.some((item) => item.id === id && item.type === type)
        ? runDataAction((uid) => removeFavorite(uid, favorite))
        : runDataAction((uid) => saveFavorite(uid, favorite));
    },
  }), [
    authStatus,
    authError,
    dataLoading,
    events,
    favorites,
    firebaseUser,
    medicines,
    runDataAction,
    searchTerm,
    setSearchTerm,
    signIn,
    signOut,
    signUp,
    theme,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
}

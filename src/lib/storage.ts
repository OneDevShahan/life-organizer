import type { AppState, EventItem, MedicineItem } from '../types';

const STORAGE_KEY = 'life-organizer-state-v1';

export const defaultEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Sunrise hike with family',
    date: '2026-11-12',
    time: '07:30',
    category: 'memory',
    location: 'Green Valley Trail',
    notes: 'Captured the best view before the weather changed.',
    mood: 'Joyful',
    favorite: true,
  },
  {
    id: 'evt-2',
    title: 'Board meeting',
    date: '2026-11-14',
    time: '10:00',
    category: 'event',
    location: 'Civic Center',
    notes: 'Review quarterly goals and team milestones.',
    mood: 'Focused',
  },
  {
    id: 'evt-3',
    title: 'Annual check-up',
    date: '2026-11-18',
    time: '15:45',
    category: 'appointment',
    location: 'City Medical Center',
    notes: 'Bring last year lab results and insurance card.',
    mood: 'Prepared',
  },
];

export const defaultMedicines: MedicineItem[] = [
  {
    id: 'med-1',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    frequency: 'Daily',
    reminderTime: '08:30',
    startDate: '2026-11-01',
    endDate: '2026-12-31',
    notes: 'Take with breakfast for better absorption.',
    category: 'supplement',
    favorite: true,
  },
  {
    id: 'med-2',
    name: 'Ibuprofen',
    dosage: '200 mg',
    frequency: 'As needed',
    reminderTime: '19:00',
    startDate: '2026-11-05',
    endDate: '2026-11-20',
    notes: 'Use only for temporary discomfort and headaches.',
    category: 'prescription',
  },
  {
    id: 'med-3',
    name: 'Omega-3',
    dosage: '1 capsule',
    frequency: 'Twice weekly',
    reminderTime: '21:00',
    startDate: '2026-11-02',
    endDate: '2026-12-31',
    notes: 'Take after dinner with water.',
    category: 'vitamin',
  },
];

export const defaultState: AppState = {
  user: {
    id: 'u-1',
    name: 'Alicia Morgan',
    email: 'alicia@example.com',
    role: 'Product Manager',
    timezone: 'GMT+5:30',
    avatar: 'AM',
  },
  theme: 'system',
  searchTerm: '',
  favorites: [
    { id: 'evt-1', type: 'event' },
    { id: 'med-1', type: 'medicine' },
  ],
  events: defaultEvents,
  medicines: defaultMedicines,
};

export function readStoredState(): AppState {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      user: { ...defaultState.user, ...(parsed.user ?? {}) },
      favorites: parsed.favorites ?? defaultState.favorites,
      events: parsed.events ?? defaultState.events,
      medicines: parsed.medicines ?? defaultState.medicines,
    };
  } catch {
    return defaultState;
  }
}

export function writeStoredState(state: AppState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

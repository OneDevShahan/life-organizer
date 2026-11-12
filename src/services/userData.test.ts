import { beforeEach, describe, expect, it, vi } from 'vitest';
import { restoreUserData, saveEvent } from './userData';

const firestoreMocks = vi.hoisted(() => {
  const batchSet = vi.fn();
  const batchCommit = vi.fn().mockResolvedValue(undefined);
  return {
    batchCommit,
    batchSet,
    collection: vi.fn((...parts: unknown[]) => parts.slice(1).join('/')),
    deleteDoc: vi.fn(),
    doc: vi.fn((...parts: unknown[]) => parts.slice(1).join('/')),
    onSnapshot: vi.fn(),
    setDoc: vi.fn(),
    writeBatch: vi.fn(() => ({ set: batchSet, commit: batchCommit })),
  };
});

vi.mock('./firebase', () => ({ firestore: { name: 'test-db' } }));
vi.mock('firebase/firestore', () => firestoreMocks);

describe('user Firestore data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes events only under the signed-in user path', async () => {
    const event = {
      id: 'event-1',
      title: 'Appointment',
      date: '2026-12-01',
      time: '09:00',
      category: 'event' as const,
      location: 'Clinic',
      notes: '',
      mood: 'calm',
    };

    await saveEvent('user-1', event);

    expect(firestoreMocks.doc).toHaveBeenCalledWith(
      { name: 'test-db' },
      'users',
      'user-1',
      'events',
      'event-1',
    );
    expect(firestoreMocks.setDoc).toHaveBeenCalledWith(
      'users/user-1/events/event-1',
      expect.objectContaining({ title: 'Appointment' }),
    );
  });

  it('restores records and preferences under the same user-scoped path', async () => {
    await restoreUserData('user-1', {
      version: 1,
      exportedAt: '2026-11-12T00:00:00.000Z',
      events: [],
      medicines: [],
      favorites: [{ id: 'event-1', type: 'event' }],
      theme: 'dark',
    });

    expect(firestoreMocks.batchSet).toHaveBeenCalledWith(
      'users/user-1/favorites/event_event-1',
      { id: 'event-1', type: 'event' },
    );
    expect(firestoreMocks.batchSet).toHaveBeenCalledWith(
      'users/user-1/preferences/settings',
      { theme: 'dark' },
      { merge: true },
    );
    expect(firestoreMocks.batchCommit).toHaveBeenCalledOnce();
  });
});

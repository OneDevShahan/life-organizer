import { describe, expect, it } from 'vitest';
import { getDueReminders, getLocalDateKey, getSentReminderKeys, saveSentReminderKeys } from './reminders';
import type { EventItem, MedicineItem } from '../types';

const event: EventItem = {
  id: 'event-1',
  title: 'Appointment',
  date: '2026-11-12',
  time: '14:05',
  category: 'appointment',
  location: 'Clinic',
  notes: '',
  mood: 'calm',
};

const medicine: MedicineItem = {
  id: 'medicine-1',
  name: 'Medicine',
  dosage: '1 tablet',
  frequency: 'Daily',
  reminderTime: '14:05',
  startDate: '2026-11-01',
  endDate: '2026-11-30',
  notes: '',
  category: 'prescription',
};

describe('reminders', () => {
  it('returns event and active medicine reminders due in the local minute', () => {
    const due = getDueReminders([event], [medicine], new Date(2026, 10, 12, 14, 5));

    expect(due.map(({ key }) => key)).toEqual([
      'event:event-1:2026-11-12',
      'medicine:medicine-1:2026-11-12',
    ]);
  });

  it('does not alert for other times or outside a medicine date range', () => {
    expect(getDueReminders([event], [{ ...medicine, endDate: '2026-11-11' }], new Date(2026, 10, 12, 14, 6)))
      .toEqual([]);
  });

  it('uses local calendar dates and persists daily deduplication keys', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    const date = getLocalDateKey(new Date(2026, 10, 12, 0, 5));
    const sent = new Set(['medicine:medicine-1:2026-11-12']);

    saveSentReminderKeys(storage, 'user-1', date, sent);

    expect(getSentReminderKeys(storage, 'user-1', date)).toEqual(sent);
    expect(getSentReminderKeys(storage, 'user-2', date)).toEqual(new Set());
  });
});

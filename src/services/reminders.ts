import type { EventItem, MedicineItem } from '../types';

export interface DueReminder {
  id: string;
  title: string;
  detail: string;
  key: string;
}

export interface ReminderStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDueReminders(
  events: EventItem[],
  medicines: MedicineItem[],
  now: Date,
): DueReminder[] {
  const date = getLocalDateKey(now);
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const due: DueReminder[] = [];

  for (const event of events) {
    if (event.date === date && event.time === time) {
      due.push({
        id: event.id,
        title: event.title,
        detail: `${event.category} · ${event.time}`,
        key: `event:${event.id}:${date}`,
      });
    }
  }

  for (const medicine of medicines) {
    if (
      medicine.reminderTime === time &&
      medicine.startDate <= date &&
      medicine.endDate >= date
    ) {
      due.push({
        id: medicine.id,
        title: medicine.name,
        detail: `Medicine reminder · ${medicine.dosage}`,
        key: `medicine:${medicine.id}:${date}`,
      });
    }
  }

  return due;
}

export function getSentReminderKeys(
  storage: ReminderStorage,
  userId: string,
  date: string,
): Set<string> {
  const storageKey = `life-organizer-alerts:${userId}:${date}`;
  const stored = storage.getItem(storageKey);
  if (!stored) {
    return new Set();
  }

  try {
    const keys: unknown = JSON.parse(stored);
    if (Array.isArray(keys) && keys.every((key): key is string => typeof key === 'string')) {
      return new Set(keys);
    }
    console.warn('Ignoring invalid saved reminder identifiers.');
  } catch (error) {
    console.warn('Ignoring unreadable saved reminder identifiers.', error);
  }

  return new Set();
}

export function saveSentReminderKeys(
  storage: ReminderStorage,
  userId: string,
  date: string,
  keys: Set<string>,
) {
  storage.setItem(
    `life-organizer-alerts:${userId}:${date}`,
    JSON.stringify([...keys]),
  );
}

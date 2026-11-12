import { z } from 'zod';
import type { EventItem, FavoriteEntry, MedicineItem, ThemeMode } from '../types';

const eventSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  date: z.string(),
  time: z.string(),
  category: z.enum(['memory', 'event', 'appointment']),
  location: z.string(),
  notes: z.string(),
  mood: z.string(),
});

const medicineSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  reminderTime: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string(),
  category: z.enum(['prescription', 'supplement', 'vitamin']),
});

const favoriteSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['event', 'medicine']),
});

const backupSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string().datetime(),
  events: z.array(eventSchema),
  medicines: z.array(medicineSchema),
  favorites: z.array(favoriteSchema),
  theme: z.enum(['light', 'dark', 'system']),
});

export interface UserDataBackup {
  version: 1;
  exportedAt: string;
  events: EventItem[];
  medicines: MedicineItem[];
  favorites: FavoriteEntry[];
  theme: ThemeMode;
}

export function createBackup(data: Omit<UserDataBackup, 'version' | 'exportedAt'>): UserDataBackup {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    ...data,
  };
}

export function parseBackup(contents: string): UserDataBackup {
  let input: unknown;
  try {
    input = JSON.parse(contents);
  } catch {
    throw new Error('This file is not valid JSON.');
  }

  const parsed = backupSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Backup file is invalid: ${parsed.error.issues[0]?.message ?? 'check its format.'}`);
  }

  return parsed.data;
}

export function serializeBackup(backup: UserDataBackup) {
  return JSON.stringify(backup, null, 2);
}

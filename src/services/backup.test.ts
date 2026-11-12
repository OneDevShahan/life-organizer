import { describe, expect, it } from 'vitest';
import { createBackup, parseBackup, serializeBackup } from './backup';

const sample = {
  events: [{
    id: 'event-1',
    title: 'Dentist',
    date: '2026-12-01',
    time: '09:30',
    category: 'appointment' as const,
    location: 'Clinic',
    notes: 'Annual checkup',
    mood: 'calm',
  }],
  medicines: [{
    id: 'medicine-1',
    name: 'Vitamin D',
    dosage: '1 tablet',
    frequency: 'Daily',
    reminderTime: '08:00',
    startDate: '2026-11-01',
    endDate: '2026-12-01',
    notes: 'With breakfast',
    category: 'vitamin' as const,
  }],
  favorites: [{ id: 'event-1', type: 'event' as const }],
  theme: 'dark' as const,
};

describe('user data backups', () => {
  it('creates a versioned backup that can be parsed back', () => {
    const backup = createBackup(sample);

    expect(backup.version).toBe(1);
    expect(parseBackup(serializeBackup(backup))).toEqual(backup);
  });

  it('rejects malformed JSON and unsupported or invalid backup data', () => {
    expect(() => parseBackup('{')).toThrow('not valid JSON');
    expect(() => parseBackup(JSON.stringify({ version: 2 }))).toThrow('Backup file is invalid');
    expect(() => parseBackup(JSON.stringify({ ...createBackup(sample), theme: 'blue' })))
      .toThrow('Backup file is invalid');
  });
});

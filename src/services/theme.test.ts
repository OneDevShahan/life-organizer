import { describe, expect, it } from 'vitest';
import { readThemePreference, resolveTheme, saveThemePreference, themeStorageKey } from './theme';

describe('theme preference', () => {
  it('reads stored theme preferences and defaults invalid values to system', () => {
    const values = new Map<string, string>([[themeStorageKey, 'dark']]);
    const storage = { getItem: (key: string) => values.get(key) ?? null };

    expect(readThemePreference(storage)).toBe('dark');
    values.set(themeStorageKey, 'invalid');
    expect(readThemePreference(storage)).toBe('system');
  });

  it('persists user-selected appearance', () => {
    const values = new Map<string, string>();
    saveThemePreference({ setItem: (key, value) => values.set(key, value) }, 'dark');

    expect(values.get(themeStorageKey)).toBe('dark');
  });

  it('resolves system appearance and preserves explicit choices', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});

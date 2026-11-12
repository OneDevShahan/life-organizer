import type { ThemeMode } from '../types';

export const themeStorageKey = 'life-organizer-theme';

export function readThemePreference(storage: Pick<Storage, 'getItem'>): ThemeMode {
  const value = storage.getItem(themeStorageKey);
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

export function saveThemePreference(storage: Pick<Storage, 'setItem'>, mode: ThemeMode) {
  storage.setItem(themeStorageKey, mode);
}

export function resolveTheme(mode: ThemeMode, systemPrefersDark: boolean): 'light' | 'dark' {
  return mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;
}

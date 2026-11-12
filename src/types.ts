export type ThemeMode = 'light' | 'dark' | 'system';

export type ModuleId =
  | 'dashboard'
  | 'events'
  | 'medicine'
  | 'search'
  | 'calendar'
  | 'favorites'
  | 'settings'
  | 'profile';

export type EventCategory = 'memory' | 'event' | 'appointment';
export type MedicineCategory = 'prescription' | 'supplement' | 'vitamin';
export type FavoriteType = 'event' | 'medicine';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  timezone: string;
  avatar: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  category: EventCategory;
  location: string;
  notes: string;
  mood: string;
  favorite?: boolean;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminderTime: string;
  startDate: string;
  endDate: string;
  notes: string;
  category: MedicineCategory;
  favorite?: boolean;
}

export interface FavoriteEntry {
  id: string;
  type: FavoriteType;
}

export interface ModuleDefinition {
  id: ModuleId;
  label: string;
  path: string;
  description: string;
  icon: string;
}

export interface AppState {
  user: UserProfile;
  theme: ThemeMode;
  searchTerm: string;
  favorites: FavoriteEntry[];
  events: EventItem[];
  medicines: MedicineItem[];
}

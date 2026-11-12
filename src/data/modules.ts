import type { ModuleDefinition } from '../types';

export const moduleRegistry: ModuleDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    description: 'Overview of your life at a glance.',
    icon: 'dashboard',
  },
  {
    id: 'events',
    label: 'Events & Memories',
    path: '/events',
    description: 'Curate important moments and life events.',
    icon: 'events',
  },
  {
    id: 'medicine',
    label: 'Medicine Library',
    path: '/medicine',
    description: 'Track care routines and medications.',
    icon: 'medicine',
  },
  {
    id: 'search',
    label: 'Global Search',
    path: '/search',
    description: 'Search across your personal data quickly.',
    icon: 'search',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    description: 'See your schedule in a calendar view.',
    icon: 'calendar',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    description: 'Keep your most important items in view.',
    icon: 'favorites',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    description: 'Personalize appearance and workspace behavior.',
    icon: 'settings',
  },
  {
    id: 'profile',
    label: 'User Profile',
    path: '/profile',
    description: 'Manage your personal information and preferences.',
    icon: 'profile',
  },
];

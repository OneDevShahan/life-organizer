import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import type { EventItem, FavoriteEntry, MedicineItem, ThemeMode } from '../types';
import type { UserDataBackup } from './backup';
import { firestore } from './firebase';

function getDatabase() {
  if (!firestore) {
    throw new Error('Firebase is not configured.');
  }

  return firestore;
}

function userCollection(uid: string, collectionName: string) {
  return collection(getDatabase(), 'users', uid, collectionName);
}

export function subscribeEvents(
  uid: string,
  onData: (items: EventItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    userCollection(uid, 'events'),
    (snapshot) => onData(snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as EventItem)),
    onError,
  );
}

export function subscribeMedicines(
  uid: string,
  onData: (items: MedicineItem[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    userCollection(uid, 'medicines'),
    (snapshot) => onData(snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as MedicineItem)),
    onError,
  );
}

export function subscribeFavorites(
  uid: string,
  onData: (items: FavoriteEntry[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    userCollection(uid, 'favorites'),
    (snapshot) =>
      onData(
        snapshot.docs
          .map((item) => item.data() as FavoriteEntry)
          .filter((item) => (item.type === 'event' || item.type === 'medicine') && Boolean(item.id)),
      ),
    onError,
  );
}

export function subscribeTheme(
  uid: string,
  onData: (theme: ThemeMode | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getDatabase(), 'users', uid, 'preferences', 'settings'),
    (snapshot) => {
      const theme = snapshot.data()?.theme;
      if (theme === 'light' || theme === 'dark' || theme === 'system') {
        onData(theme);
      } else {
        onData(null);
      }
    },
    onError,
  );
}

export function saveEvent(uid: string, item: EventItem) {
  const { id, ...data } = item;
  return setDoc(doc(getDatabase(), 'users', uid, 'events', id), data);
}

export function removeEvent(uid: string, id: string) {
  return deleteDoc(doc(getDatabase(), 'users', uid, 'events', id));
}

export function saveMedicine(uid: string, item: MedicineItem) {
  const { id, ...data } = item;
  return setDoc(doc(getDatabase(), 'users', uid, 'medicines', id), data);
}

export function removeMedicine(uid: string, id: string) {
  return deleteDoc(doc(getDatabase(), 'users', uid, 'medicines', id));
}

export function saveFavorite(uid: string, favorite: FavoriteEntry) {
  const favoriteId = `${favorite.type}_${favorite.id}`;
  return setDoc(doc(getDatabase(), 'users', uid, 'favorites', favoriteId), favorite);
}

export function removeFavorite(uid: string, favorite: FavoriteEntry) {
  const favoriteId = `${favorite.type}_${favorite.id}`;
  return deleteDoc(doc(getDatabase(), 'users', uid, 'favorites', favoriteId));
}

export function saveTheme(uid: string, theme: ThemeMode) {
  return setDoc(doc(getDatabase(), 'users', uid, 'preferences', 'settings'), { theme }, { merge: true });
}

export async function restoreUserData(uid: string, backup: UserDataBackup) {
  const database = getDatabase();
  const writes: Array<(batch: ReturnType<typeof writeBatch>) => void> = [];

  for (const { id, ...data } of backup.events) {
    writes.push((batch) => batch.set(doc(database, 'users', uid, 'events', id), data));
  }
  for (const { id, ...data } of backup.medicines) {
    writes.push((batch) => batch.set(doc(database, 'users', uid, 'medicines', id), data));
  }
  for (const favorite of backup.favorites) {
    writes.push((batch) => batch.set(
      doc(database, 'users', uid, 'favorites', `${favorite.type}_${favorite.id}`),
      favorite,
    ));
  }
  writes.push((batch) => batch.set(
    doc(database, 'users', uid, 'preferences', 'settings'),
    { theme: backup.theme },
    { merge: true },
  ));

  for (let index = 0; index < writes.length; index += 450) {
    const batch = writeBatch(database);
    writes.slice(index, index + 450).forEach((write) => write(batch));
    await batch.commit();
  }
}

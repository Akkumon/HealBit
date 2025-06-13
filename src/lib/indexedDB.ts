import { MoodType, JournalEntry } from '../types/index'; // Assuming JournalEntry is defined in '@/types'

export interface IndexedDBConfig {
  name: string;
  version: number;
  stores: {
    name: string;
    options: IDBObjectStoreParameters;
    indexes?: { name: string; keyPath: string; options?: IDBIndexParameters }[];
  }[];
}

const DB_CONFIG: IndexedDBConfig = {
  name: 'HealBitDB',
  version: 1,
  stores: [
    {
      name: 'journalEntries',
      options: { keyPath: 'id', autoIncrement: false },
      indexes: [
        { name: 'date', keyPath: 'date', options: { unique: false } },
        { name: 'mood', keyPath: 'mood', options: { unique: false } },
      ],
    },
  ],
};

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      DB_CONFIG.stores.forEach((storeConfig) => {
        if (!db.objectStoreNames.contains(storeConfig.name)) {
          const objectStore = db.createObjectStore(storeConfig.name, storeConfig.options);
          storeConfig.indexes?.forEach((indexConfig) => {
            objectStore.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options);
          });
        }
      });
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const addJournalEntry = async (db: IDBDatabase, entry: JournalEntry): Promise<void> => {
  const transaction = db.transaction(['journalEntries'], 'readwrite');
  const objectStore = transaction.objectStore('journalEntries');
  return new Promise((resolve, reject) => {
    const request = objectStore.add(entry);
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject((event.target as IDBRequest).error);
  });
};

export const getJournalEntries = async (db: IDBDatabase): Promise<JournalEntry[]> => {
  const transaction = db.transaction(['journalEntries'], 'readonly');
  const objectStore = transaction.objectStore('journalEntries');
  return new Promise((resolve, reject) => {
    const request = objectStore.getAll();
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event) => reject((event.target as IDBRequest).error);
  });
};

export const clearAllEntries = async (db: IDBDatabase): Promise<void> => {
  const transaction = db.transaction(['journalEntries'], 'readwrite');
  const objectStore = transaction.objectStore('journalEntries');
  return new Promise((resolve, reject) => {
    const request = objectStore.clear();
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject((event.target as IDBRequest).error);
  });
}; 
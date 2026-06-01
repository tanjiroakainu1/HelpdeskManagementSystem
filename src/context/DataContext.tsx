import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';
import { subscribeDbChange } from '@/lib/data-events';
import { STORAGE_KEY } from '@/lib/db';
import type { AppDatabase } from '@/types';

interface DataContextValue {
  version: number;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    api.getDb();
    const unsub = subscribeDbChange(() => refresh());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      unsub();
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  return (
    <DataContext.Provider value={{ version, refresh }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData outside provider');
  return ctx;
}

/** Subscribe to DB; returns fresh snapshot from the system store. */
export function useDb(): { db: AppDatabase; version: number } {
  const { version } = useData();
  return { db: api.getDb(), version };
}

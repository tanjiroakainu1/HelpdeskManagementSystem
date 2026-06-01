import { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { api } from '@/lib/api';
import type { AppDatabase } from '@/types';

/**
 * Subscribe to localStorage-backed data. Re-renders when any api.mutate/save runs.
 */
export function useAppDb(): AppDatabase {
  const { version } = useData();
  return useMemo(() => api.getDb(), [version]);
}

/** Same as useAppDb but returns version for keys. */
export function useAppData() {
  const { version, refresh } = useData();
  const db = useMemo(() => api.getDb(), [version]);
  return { db, version, refresh, api };
}

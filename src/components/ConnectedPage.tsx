import { ComponentType } from 'react';
import { useDb } from '@/context/DataContext';

/** Ensures role pages re-render when system data changes. */
export function ConnectedPage({ component: Page }: { component: ComponentType }) {
  useDb();
  return <Page />;
}

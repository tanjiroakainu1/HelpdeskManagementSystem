import { ComponentType } from 'react';
import { useDb } from '@/context/DataContext';

/** Ensures role pages re-render when localStorage data changes. */
export function ConnectedPage({ component: Page }: { component: ComponentType }) {
  useDb();
  return <Page />;
}

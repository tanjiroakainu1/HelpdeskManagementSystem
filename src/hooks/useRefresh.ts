import { useData } from '@/context/DataContext';

export function useRefresh() {
  const { refresh } = useData();
  return refresh;
}

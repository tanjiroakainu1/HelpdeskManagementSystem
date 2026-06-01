import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { AssistantAudience } from '@/lib/ai/types';

/** Resolves chat quick-questions + context: signed-in role, or guest on auth/home pages. */
export function useAssistantAudience(): AssistantAudience {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (user) return user.role;

  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return 'guest';
  }

  return 'guest';
}

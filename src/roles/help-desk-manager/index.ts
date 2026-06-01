import type { UserRole } from '@/types';
import { ROLE_CONFIGS } from '@/lib/roles';
import { buildPageMap } from '@/roles/buildPageMap';
import { pages } from './pages';

export const ROLE_KEY: UserRole = 'help_desk_manager';
export const ROLE_FOLDER = 'help-desk-manager';
export const roleConfig = ROLE_CONFIGS.find((r) => r.key === ROLE_KEY)!;
export const pageMap = buildPageMap(ROLE_FOLDER, pages);

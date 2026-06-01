import type { AppDatabase, Ticket, User, UserRole } from '@/types';

const AGENT_ROLES: UserRole[] = ['support_agent', 'it_technician'];
const MANAGER_ROLES: UserRole[] = ['support_supervisor', 'help_desk_manager'];

/** Tickets a role can act on in message / status forms. */
export function ticketsForRole(user: User, db: AppDatabase): Ticket[] {
  const open = db.tickets.filter((t) => t.status !== 'closed' && t.status !== 'draft');
  if (MANAGER_ROLES.includes(user.role)) return open;
  if (AGENT_ROLES.includes(user.role)) {
    const mine = open.filter((t) => t.assignedTo === user.id);
    if (mine.length) return mine;
    return open.filter((t) => t.assignedTo === user.id || t.assignedTo == null);
  }
  return open.filter((t) => t.assignedTo === user.id);
}

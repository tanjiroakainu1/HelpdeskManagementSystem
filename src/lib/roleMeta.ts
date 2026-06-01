import type { UserRole } from '@/types';

/** Role avatars — candy emerald × purple galaxy palette */
export const ROLE_META: Record<
  UserRole,
  { shortLabel: string; icon: string; gradient: string; ring: string }
> = {
  super_admin: {
    shortLabel: 'Super Admin',
    icon: '⚡',
    gradient: 'from-galaxy-deep via-galaxy to-galaxy-soft',
    ring: 'ring-galaxy-soft/50',
  },
  help_desk_manager: {
    shortLabel: 'Desk Manager',
    icon: '📋',
    gradient: 'from-candy-dark to-candy-light',
    ring: 'ring-candy/50',
  },
  support_supervisor: {
    shortLabel: 'Supervisor',
    icon: '👁',
    gradient: 'from-galaxy to-candy',
    ring: 'ring-accent-soft/50',
  },
  support_agent: {
    shortLabel: 'Support Agent',
    icon: '💬',
    gradient: 'from-candy to-galaxy-soft',
    ring: 'ring-candy-light/50',
  },
  it_technician: {
    shortLabel: 'IT Technician',
    icon: '🔧',
    gradient: 'from-emerald-500 to-candy-bright',
    ring: 'ring-candy/50',
  },
  department_head: {
    shortLabel: 'Dept Head',
    icon: '🏢',
    gradient: 'from-galaxy-nebula to-galaxy-soft',
    ring: 'ring-galaxy-soft/40',
  },
  employee: {
    shortLabel: 'Employee',
    icon: '🙋',
    gradient: 'from-candy-light to-galaxy',
    ring: 'ring-candy-mint/50',
  },
  knowledge_base_editor: {
    shortLabel: 'KB Editor',
    icon: '📚',
    gradient: 'from-galaxy-soft to-candy',
    ring: 'ring-galaxy-dust/40',
  },
  qa_officer: {
    shortLabel: 'QA Officer',
    icon: '✓',
    gradient: 'from-candy-bright to-candy-dark',
    ring: 'ring-accent-glow/50',
  },
  system_auditor: {
    shortLabel: 'Auditor',
    icon: '🔍',
    gradient: 'from-surface-3 to-galaxy-deep',
    ring: 'ring-border-light/50',
  },
};

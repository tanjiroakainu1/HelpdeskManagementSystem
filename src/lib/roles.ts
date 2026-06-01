import type { RoleConfig, UserRole } from '@/types';

export const DEMO_PASSWORD = 'password123';

export const ROLES: Record<UserRole, { label: string; folder: string }> = {
  super_admin: { label: 'Super Admin', folder: 'super-admin' },
  help_desk_manager: { label: 'Help Desk Manager', folder: 'help-desk-manager' },
  support_supervisor: { label: 'Support Supervisor', folder: 'support-supervisor' },
  support_agent: { label: 'Support Agent', folder: 'support-agent' },
  it_technician: { label: 'IT Technician', folder: 'it-technician' },
  department_head: { label: 'Department Head', folder: 'department-head' },
  employee: { label: 'Employee / Customer', folder: 'employee-customer' },
  knowledge_base_editor: { label: 'Knowledge Base Editor', folder: 'knowledge-base-editor' },
  qa_officer: { label: 'Quality Assurance Officer', folder: 'quality-assurance-officer' },
  system_auditor: { label: 'System Auditor', folder: 'system-auditor' },
};

export const DEMO_ACCOUNTS: Record<UserRole, string> = {
  super_admin: 'admin@helpdesk.local',
  help_desk_manager: 'manager@helpdesk.local',
  support_supervisor: 'supervisor@helpdesk.local',
  support_agent: 'agent@helpdesk.local',
  it_technician: 'technician@helpdesk.local',
  department_head: 'depthead@helpdesk.local',
  employee: 'employee@helpdesk.local',
  knowledge_base_editor: 'kb@helpdesk.local',
  qa_officer: 'qa@helpdesk.local',
  system_auditor: 'auditor@helpdesk.local',
};

/** Shared menu item — all roles can view CRUD activity log */
export const SHARED_SYSTEM_RECORDS_MENU = { label: 'System Records', slug: 'system-records' } as const;

const PROFILE_MENU = { label: 'My Profile', slug: 'profile' } as const;

const withProfileMenu = (config: RoleConfig): RoleConfig => {
  const menus = config.menus.filter((m) => m.slug !== 'profile');
  const dashIdx = menus.findIndex((m) => m.slug === 'dashboard');
  const insertAt = dashIdx >= 0 ? dashIdx + 1 : 0;
  return {
    ...config,
    menus: [...menus.slice(0, insertAt), PROFILE_MENU, ...menus.slice(insertAt)],
  };
};

const withSharedRecords = (config: RoleConfig): RoleConfig => ({
  ...config,
  menus: [...config.menus, SHARED_SYSTEM_RECORDS_MENU],
});

/** Mirrors PHP includes/role-nav.php — slug = PHP filename without .php */
const ROLE_CONFIGS_BASE: RoleConfig[] = [
  {
    key: 'super_admin',
    label: ROLES.super_admin.label,
    folder: ROLES.super_admin.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'System Access', slug: 'system-access' },
      { label: 'Users', slug: 'users' },
      { label: 'Roles', slug: 'roles' },
      { label: 'Permissions', slug: 'permissions' },
      { label: 'Settings', slug: 'settings' },
      { label: 'Departments', slug: 'departments' },
      { label: 'Reports', slug: 'reports' },
      { label: 'Activity', slug: 'activity' },
    ],
  },
  {
    key: 'help_desk_manager',
    label: ROLES.help_desk_manager.label,
    folder: ROLES.help_desk_manager.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Operations', slug: 'operations' },
      { label: 'Queues', slug: 'queues' },
      { label: 'Assign Tickets', slug: 'assign-tickets' },
      { label: 'SLA', slug: 'sla' },
      { label: 'Reports', slug: 'reports' },
      { label: 'Performance', slug: 'performance' },
      { label: 'Escalations', slug: 'escalations' },
    ],
  },
  {
    key: 'support_supervisor',
    label: ROLES.support_supervisor.label,
    folder: ROLES.support_supervisor.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Agents', slug: 'agents' },
      { label: 'Ticket Progress', slug: 'tickets' },
      { label: 'Reassign', slug: 'reassign' },
      { label: 'Escalations', slug: 'escalations' },
      { label: 'Performance', slug: 'performance' },
      { label: 'SLA Compliance', slug: 'sla-compliance' },
      { label: 'Approvals', slug: 'approvals' },
    ],
  },
  {
    key: 'support_agent',
    label: ROLES.support_agent.label,
    folder: ROLES.support_agent.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'My Tickets', slug: 'my-tickets' },
      { label: 'Respond', slug: 'respond-inquiries' },
      { label: 'Troubleshoot', slug: 'troubleshoot' },
      { label: 'Update Status', slug: 'update-status' },
      { label: 'Ticket Notes', slug: 'ticket-notes' },
      { label: 'Resolve', slug: 'resolve-ticket' },
      { label: 'Communicate', slug: 'communicate' },
    ],
  },
  {
    key: 'it_technician',
    label: ROLES.it_technician.label,
    folder: ROLES.it_technician.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Technical Tickets', slug: 'technical-tickets' },
      { label: 'Hardware', slug: 'hardware-maintenance' },
      { label: 'Software', slug: 'software-troubleshoot' },
      { label: 'Network', slug: 'network-issues' },
      { label: 'Repairs', slug: 'repairs' },
      { label: 'Reports', slug: 'reports' },
      { label: 'Escalate', slug: 'escalate-issues' },
      { label: 'Assets', slug: 'assets' },
    ],
  },
  {
    key: 'department_head',
    label: ROLES.department_head.label,
    folder: ROLES.department_head.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Dept Requests', slug: 'monitor-requests' },
      { label: 'Approvals', slug: 'approvals' },
      { label: 'Track Status', slug: 'track-status' },
      { label: 'Reports', slug: 'reports' },
      { label: 'Coordinate', slug: 'coordinate-support' },
      { label: 'Review Resolved', slug: 'review-resolved' },
    ],
  },
  {
    key: 'employee',
    label: ROLES.employee.label,
    folder: ROLES.employee.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Submit Ticket', slug: 'submit-ticket' },
      { label: 'My Tickets', slug: 'my-tickets' },
      { label: 'Ticket Status', slug: 'ticket-view' },
      { label: 'Messages', slug: 'ticket-messages' },
      { label: 'Upload Files', slug: 'upload-documents' },
      { label: 'Knowledge Base', slug: 'knowledge-base' },
      { label: 'Reopen Ticket', slug: 'reopen-ticket' },
      { label: 'Feedback', slug: 'feedback' },
    ],
  },
  {
    key: 'knowledge_base_editor',
    label: ROLES.knowledge_base_editor.label,
    folder: ROLES.knowledge_base_editor.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Create Article', slug: 'create-articles' },
      { label: 'Edit Articles', slug: 'edit-articles' },
      { label: 'FAQs', slug: 'faqs' },
      { label: 'Categories', slug: 'categories' },
      { label: 'Publish', slug: 'publish-articles' },
      { label: 'Update Outdated', slug: 'update-articles' },
    ],
  },
  {
    key: 'qa_officer',
    label: ROLES.qa_officer.label,
    folder: ROLES.qa_officer.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Reviews', slug: 'reviews' },
      { label: 'Service Quality', slug: 'service-quality' },
      { label: 'Evaluate Performance', slug: 'evaluate-performance' },
      { label: 'Satisfaction', slug: 'satisfaction' },
      { label: 'Quality Reports', slug: 'reports' },
      { label: 'Improvements', slug: 'process-improvements' },
    ],
  },
  {
    key: 'system_auditor',
    label: ROLES.system_auditor.label,
    folder: ROLES.system_auditor.folder,
    menus: [
      { label: 'Dashboard', slug: 'dashboard' },
      { label: 'Activity Logs', slug: 'activity-logs' },
      { label: 'User Actions', slug: 'user-actions' },
      { label: 'Ticket Audit', slug: 'ticket-audit' },
      { label: 'Compliance', slug: 'compliance' },
      { label: 'Audit Reports', slug: 'audit-reports' },
      { label: 'Security', slug: 'security-concerns' },
    ],
  },
];

export const ROLE_CONFIGS: RoleConfig[] = ROLE_CONFIGS_BASE.map(withProfileMenu).map(withSharedRecords);

export function getRoleByFolder(folder: string): RoleConfig | undefined {
  return ROLE_CONFIGS.find((r) => r.folder === folder);
}

export function dashboardPath(role: UserRole): string {
  return `/${ROLES[role].folder}/dashboard`;
}

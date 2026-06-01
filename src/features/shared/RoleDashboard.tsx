import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatGrid } from '@/components/ui/StatGrid';
import { QuickRoleAccess } from '@/components/QuickRoleAccess';
import { SystemRecordsTable, systemRecordsPath } from '@/features/shared/SystemRecordsTable';
import { api } from '@/lib/api';
import { navIcon } from '@/lib/navIcons';
import { useAuth } from '@/context/AuthContext';
import { useAppDb } from '@/hooks/useAppDb';
import { HelpdeskCharts } from '@/components/charts/HelpdeskCharts';
import { ROLES, ROLE_CONFIGS } from '@/lib/roles';
import type { UserRole } from '@/types';

export function RoleDashboard({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const db = useAppDb();
  const stats = api.ticketStats();
  const folder = ROLES[role].folder;
  const menus = ROLE_CONFIGS.find((r) => r.key === role)!.menus.filter(
    (m) => m.slug !== 'dashboard' && m.slug !== 'profile',
  );

  const extra: Record<UserRole, { label: string; value: number }[]> = {
    super_admin: [
      { label: 'Users', value: db.users.length },
      { label: 'Departments', value: db.departments.length },
    ],
    help_desk_manager: [{ label: 'Pending Escalations', value: db.escalations.filter((e) => e.status === 'pending').length }],
    support_supervisor: [{ label: 'Pending Approvals', value: db.tickets.filter((t) => t.status === 'resolved' && !t.supervisorApproved).length }],
    support_agent: [{ label: 'My Active', value: db.tickets.filter((t) => t.assignedTo === user?.id && !['closed', 'resolved'].includes(t.status)).length }],
    it_technician: [{ label: 'Open Repairs', value: db.repairLogs.filter((r) => r.status !== 'completed').length }],
    department_head: [],
    employee: [],
    knowledge_base_editor: [{ label: 'Published', value: db.knowledgeArticles.filter((a) => a.status === 'published').length }],
    qa_officer: [{ label: 'Pending QA', value: db.tickets.filter((t) => t.status === 'closed' && !t.qaReviewed).length }],
    system_auditor: [{ label: 'Audit Logs', value: db.auditLogs.length }],
  };

  return (
    <>
      <PageHeader
        title={`${ROLES[role].label} Dashboard`}
        description="Overview, shortcuts, and live activity across the helpdesk."
      />
      <StatGrid
        items={[
          { label: 'Open Tickets', value: stats.open, accent: true },
          { label: 'Escalated', value: stats.escalated },
          { label: 'Resolved', value: stats.resolved },
          { label: 'SLA Breaches', value: stats.slaBreach, danger: true },
          ...extra[role].map((e) => ({ label: e.label, value: e.value })),
        ]}
      />
      <HelpdeskCharts layout="full" requesterId={role === 'employee' ? user?.id : undefined} />
      <QuickRoleAccess />
      <div className="card">
        <div className="card-header">
          <h2>Your functions</h2>
          <span className="text-xs text-muted">{menus.length} modules</span>
        </div>
        <div className="card-body">
          <div className="nav-pill-grid">
            {menus.map((m) => (
              <Link key={m.slug} to={`/${folder}/${m.slug}`} className="nav-pill w-full sm:w-auto">
                <span className="nav-pill-icon" aria-hidden>{navIcon(m.slug)}</span>
                <span className="truncate">{m.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h2>Latest system activity</h2>
          <Link to={systemRecordsPath(folder)} className="link-accent text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="card-body card-body--flush-table">
          <SystemRecordsTable
            records={db.systemRecords.slice(0, 8)}
            compact
            showViewAll
            viewAllHref={systemRecordsPath(folder)}
          />
        </div>
      </div>
    </>
  );
}

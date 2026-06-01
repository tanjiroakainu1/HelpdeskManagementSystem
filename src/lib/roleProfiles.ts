import { DEMO_ACCOUNTS } from '@/lib/roles';
import type { UserRole } from '@/types';

export interface RoleProfileDetail {
  role: UserRole;
  title: string;
  summary: string;
  mission: string;
  responsibilities: string[];
  permissions: string[];
  workflows: string[];
  kpis: string[];
  reportsTo: string;
  collaboratesWith: string[];
  demoAccountEmail: string;
}

export const ROLE_PROFILES: Record<UserRole, RoleProfileDetail> = {
  super_admin: {
    role: 'super_admin',
    title: 'Super Administrator',
    summary: 'Full platform authority — users, roles, departments, settings, and global visibility.',
    mission: 'Keep the helpdesk secure, configured, and aligned with organizational policy.',
    responsibilities: [
      'Manage user accounts, roles, and permission matrices',
      'Configure departments, SLA policies, and system settings',
      'Monitor platform-wide activity and audit trails',
      'Oversee reports, access control, and operational health',
    ],
    permissions: [
      'Full read/write on all modules and records',
      'User & role administration',
      'Department and settings management',
      'Global reports and activity logs',
    ],
    workflows: [
      'Onboard users → assign role & department',
      'Tune SLA policies and site settings',
      'Review system activity and compliance signals',
    ],
    kpis: ['User adoption', 'SLA policy coverage', 'System uptime', 'Audit completeness'],
    reportsTo: 'Executive IT / CIO office',
    collaboratesWith: ['Help Desk Manager', 'System Auditor', 'Department Heads'],
    demoAccountEmail: DEMO_ACCOUNTS.super_admin,
  },
  help_desk_manager: {
    role: 'help_desk_manager',
    title: 'Help Desk Manager',
    summary: 'Operational lead for queues, assignments, SLA performance, and escalations.',
    mission: 'Deliver consistent service levels and efficient ticket flow across the desk.',
    responsibilities: [
      'Run daily operations and queue health checks',
      'Assign and balance tickets across agents',
      'Monitor SLA compliance and escalation queues',
      'Publish performance and operations reports',
    ],
    permissions: [
      'View and manage all desk tickets',
      'Assign, re-prioritize, and escalate tickets',
      'Access SLA dashboards and performance metrics',
      'Approve operational escalations',
    ],
    workflows: [
      'Morning queue triage → assign by priority & skill',
      'SLA breach review → escalate or reassign',
      'Weekly performance review with supervisors',
    ],
    kpis: ['SLA attainment %', 'Mean time to assign', 'Escalation rate', 'Queue backlog'],
    reportsTo: 'Super Admin / IT Director',
    collaboratesWith: ['Support Supervisor', 'Support Agents', 'IT Technician'],
    demoAccountEmail: DEMO_ACCOUNTS.help_desk_manager,
  },
  support_supervisor: {
    role: 'support_supervisor',
    title: 'Support Supervisor',
    summary: 'Team lead for agents — coaching, reassignments, approvals, and SLA oversight.',
    mission: 'Ensure quality resolutions and timely closures with a high-performing agent team.',
    responsibilities: [
      'Supervise agent workload and ticket quality',
      'Reassign tickets and handle escalations',
      'Approve ticket closures and SLA exceptions',
      'Track team performance and SLA compliance',
    ],
    permissions: [
      'View all team tickets and agent metrics',
      'Reassign tickets between agents',
      'Approve resolved tickets for closure',
      'Manage escalation workflows',
    ],
    workflows: [
      'Agent stand-up → review open & at-risk tickets',
      'Closure approval queue → QA handoff when needed',
      'Escalation triage with desk manager',
    ],
    kpis: ['First-contact resolution', 'Approval turnaround', 'Agent utilization', 'CSAT proxy'],
    reportsTo: 'Help Desk Manager',
    collaboratesWith: ['Support Agents', 'QA Officer', 'Help Desk Manager'],
    demoAccountEmail: DEMO_ACCOUNTS.support_supervisor,
  },
  support_agent: {
    role: 'support_agent',
    title: 'Support Agent',
    summary: 'Front-line resolver for employee inquiries — troubleshoot, communicate, and close tickets.',
    mission: 'Resolve requests quickly with clear communication and accurate documentation.',
    responsibilities: [
      'Work assigned ticket queue daily',
      'Respond to requesters and log internal notes',
      'Troubleshoot issues and update ticket status',
      'Resolve tickets or escalate when needed',
    ],
    permissions: [
      'Manage tickets assigned to self',
      'Add public replies and internal notes',
      'Update status, priority, and resolution',
      'Communicate with requesters',
    ],
    workflows: [
      'Pick up assigned ticket → diagnose → update status',
      'Customer reply → document → resolve or escalate',
      'Hand off to IT for technical depth when required',
    ],
    kpis: ['Tickets closed per day', 'Response time', 'Reopen rate', 'Customer satisfaction'],
    reportsTo: 'Support Supervisor',
    collaboratesWith: ['IT Technician', 'Knowledge Base Editor', 'Employees'],
    demoAccountEmail: DEMO_ACCOUNTS.support_agent,
  },
  it_technician: {
    role: 'it_technician',
    title: 'IT Technician',
    summary: 'Hands-on technical specialist for hardware, software, network, assets, and repairs.',
    mission: 'Restore systems and infrastructure with minimal downtime and clear repair records.',
    responsibilities: [
      'Handle technical and infrastructure tickets',
      'Perform hardware maintenance and software fixes',
      'Manage asset inventory and repair logs',
      'Escalate complex issues with full technical context',
    ],
    permissions: [
      'Access technical ticket queues',
      'Log repairs, assets, and maintenance',
      'Update network and software troubleshooting records',
      'Create technical escalations',
    ],
    workflows: [
      'Technical ticket intake → diagnose → repair log',
      'Asset update on deploy/retire',
      'Escalate vendor or architecture issues to manager',
    ],
    kpis: ['Mean time to repair', 'Asset accuracy', 'Repeat incident rate', 'Critical uptime'],
    reportsTo: 'Help Desk Manager',
    collaboratesWith: ['Support Agents', 'Supervisor', 'Super Admin'],
    demoAccountEmail: DEMO_ACCOUNTS.it_technician,
  },
  department_head: {
    role: 'department_head',
    title: 'Department Head',
    summary: 'Departmental stakeholder for requests, approvals, tracking, and support coordination.',
    mission: 'Ensure department requests are appropriate, approved, and resolved satisfactorily.',
    responsibilities: [
      'Monitor department ticket volume and status',
      'Approve or reject department requests',
      'Track SLA and resolution for own teams',
      'Coordinate with help desk on priorities',
    ],
    permissions: [
      'View department-scoped tickets',
      'Approve department requests',
      'Run department reports',
      'Review resolved tickets',
    ],
    workflows: [
      'New request → dept approval → desk assignment',
      'Weekly status review with help desk',
      'Sign-off on resolved high-impact items',
    ],
    kpis: ['Approval turnaround', 'Dept SLA compliance', 'Request volume trends', 'Reopen rate'],
    reportsTo: 'Department executive',
    collaboratesWith: ['Help Desk Manager', 'Employees', 'Support Supervisor'],
    demoAccountEmail: DEMO_ACCOUNTS.department_head,
  },
  employee: {
    role: 'employee',
    title: 'Employee / Customer',
    summary: 'End user who submits tickets, tracks progress, and uses the knowledge base.',
    mission: 'Get timely help for workplace issues with clear visibility into ticket progress.',
    responsibilities: [
      'Submit well-described support tickets',
      'Respond to agent questions promptly',
      'Use knowledge base for self-service',
      'Provide feedback after resolution',
    ],
    permissions: [
      'Create and view own tickets',
      'Message agents on own tickets',
      'Upload supporting documents',
      'Browse published knowledge articles',
    ],
    workflows: [
      'Search KB → if unresolved, submit ticket',
      'Track status → reply to agent → confirm resolution',
      'Reopen if issue persists; submit feedback',
    ],
    kpis: ['Self-service deflection', 'Time to first response (experienced)', 'Feedback score', 'Reopen rate'],
    reportsTo: 'Department Head (for approvals)',
    collaboratesWith: ['Support Agents', 'Knowledge Base Editor'],
    demoAccountEmail: DEMO_ACCOUNTS.employee,
  },
  knowledge_base_editor: {
    role: 'knowledge_base_editor',
    title: 'Knowledge Base Editor',
    summary: 'Owns article quality — create, edit, categorize, publish, and refresh KB content.',
    mission: 'Reduce repeat tickets through accurate, findable self-service documentation.',
    responsibilities: [
      'Author and maintain knowledge articles',
      'Organize categories and FAQs',
      'Publish, archive, and update outdated content',
      'Align articles with common ticket themes',
    ],
    permissions: [
      'Full CRUD on knowledge articles',
      'Manage categories and publication status',
      'View ticket trends for content gaps',
    ],
    workflows: [
      'Draft article → review → publish',
      'Archive obsolete content; refresh stale articles',
      'Partner with agents on top incident topics',
    ],
    kpis: ['Published article count', 'KB views', 'Deflection rate', 'Content freshness'],
    reportsTo: 'Help Desk Manager',
    collaboratesWith: ['Support Agents', 'QA Officer', 'Super Admin'],
    demoAccountEmail: DEMO_ACCOUNTS.knowledge_base_editor,
  },
  qa_officer: {
    role: 'qa_officer',
    title: 'Quality Assurance Officer',
    summary: 'Quality gate for service — reviews, satisfaction, performance evaluation, improvements.',
    mission: 'Uphold service standards and drive continuous improvement across support.',
    responsibilities: [
      'Review closed tickets for quality',
      'Measure service quality and satisfaction',
      'Evaluate agent and process performance',
      'Recommend process improvements',
    ],
    permissions: [
      'Access QA review queues',
      'View satisfaction and quality reports',
      'Mark tickets QA-reviewed',
      'Publish quality improvement notes',
    ],
    workflows: [
      'Sample closed tickets → score → feedback',
      'Monthly quality report → improvement plan',
      'Coordinate with supervisor on coaching',
    ],
    kpis: ['QA pass rate', 'CSAT / satisfaction', 'Defect rate', 'Improvement adoption'],
    reportsTo: 'Help Desk Manager',
    collaboratesWith: ['Support Supervisor', 'Support Agents', 'System Auditor'],
    demoAccountEmail: DEMO_ACCOUNTS.qa_officer,
  },
  system_auditor: {
    role: 'system_auditor',
    title: 'System Auditor',
    summary: 'Independent oversight — activity logs, compliance, security, and audit reporting.',
    mission: 'Provide traceability and compliance evidence across all helpdesk operations.',
    responsibilities: [
      'Review user actions and activity logs',
      'Audit ticket lifecycle and changes',
      'Monitor compliance and security concerns',
      'Produce audit reports for stakeholders',
    ],
    permissions: [
      'Read-only access to logs and records',
      'Ticket audit trails and user action history',
      'Compliance and security dashboards',
      'Export audit reports',
    ],
    workflows: [
      'Periodic log review → flag anomalies',
      'Ticket audit sampling → compliance report',
      'Security concern triage → escalate to admin',
    ],
    kpis: ['Audit coverage', 'Finding resolution time', 'Log completeness', 'Compliance score'],
    reportsTo: 'Super Admin / Compliance office',
    collaboratesWith: ['Super Admin', 'Help Desk Manager', 'QA Officer'],
    demoAccountEmail: DEMO_ACCOUNTS.system_auditor,
  },
};

export function getRoleProfile(role: UserRole): RoleProfileDetail {
  return ROLE_PROFILES[role];
}

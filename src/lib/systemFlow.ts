import type { UserRole } from '@/types';

export interface WorkflowStep {
  step: number;
  title: string;
  summary: string;
  icon: string;
  roles: UserRole[];
}

/** End-to-end helpdesk journey shown on the public home page. */
export const SYSTEM_WORKFLOW: WorkflowStep[] = [
  {
    step: 1,
    title: 'Submit request',
    summary: 'Employees and customers create tickets with priority, details, files, and messages.',
    icon: '📝',
    roles: ['employee'],
  },
  {
    step: 2,
    title: 'Triage & assign',
    summary: 'Help Desk Manager routes tickets to queues and agents. SLA timers and escalations apply.',
    icon: '📥',
    roles: ['help_desk_manager', 'department_head'],
  },
  {
    step: 3,
    title: 'Work the ticket',
    summary: 'Agents troubleshoot, update status, and chat with requesters. IT handles hardware, software, and network.',
    icon: '🔧',
    roles: ['support_agent', 'it_technician', 'support_supervisor'],
  },
  {
    step: 4,
    title: 'Approve & close',
    summary: 'Supervisors sign off resolutions. Department heads approve department requests. Tickets move to resolved and closed.',
    icon: '✅',
    roles: ['support_supervisor', 'department_head'],
  },
  {
    step: 5,
    title: 'Quality & knowledge',
    summary: 'QA reviews service quality. Knowledge Base Editor publishes articles so fewer repeat tickets.',
    icon: '📚',
    roles: ['qa_officer', 'knowledge_base_editor'],
  },
  {
    step: 6,
    title: 'Govern & audit',
    summary: 'Super Admin manages users and settings. System Auditor reviews logs. Every action is logged in System Records.',
    icon: '🔍',
    roles: ['super_admin', 'system_auditor'],
  },
];

export const TICKET_STATUS_FLOW = [
  'Open',
  'Assigned',
  'In progress',
  'Escalated',
  'Resolved',
  'Closed',
] as const;

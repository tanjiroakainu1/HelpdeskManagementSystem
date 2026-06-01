import type { ComponentType } from 'react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import ActivityLogs from './ActivityLogs';
import UserActions from './UserActions';
import TicketAudit from './TicketAudit';
import Compliance from './Compliance';
import AuditReports from './AuditReports';
import SecurityConcerns from './SecurityConcerns';

export const pages: Record<string, ComponentType> = {
  'dashboard': Dashboard,
  profile: Profile,
  'activity-logs': ActivityLogs,
  'user-actions': UserActions,
  'ticket-audit': TicketAudit,
  'compliance': Compliance,
  'audit-reports': AuditReports,
  'security-concerns': SecurityConcerns,
};

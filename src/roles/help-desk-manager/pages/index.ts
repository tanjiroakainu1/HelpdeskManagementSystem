import type { ComponentType } from 'react';
import AssignTickets from './AssignTickets';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Escalations from './Escalations';
import Operations from './Operations';
import Performance from './Performance';
import Queues from './Queues';
import Reports from './Reports';
import Sla from './Sla';

export const pages: Record<string, ComponentType> = {
  dashboard: Dashboard,
  profile: Profile,
  operations: Operations,
  queues: Queues,
  'assign-tickets': AssignTickets,
  sla: Sla,
  reports: Reports,
  performance: Performance,
  escalations: Escalations,
};

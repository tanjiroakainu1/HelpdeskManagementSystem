import type { ComponentType } from 'react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Agents from './Agents';
import Tickets from './Tickets';
import Reassign from './Reassign';
import Escalations from './Escalations';
import Performance from './Performance';
import SlaCompliance from './SlaCompliance';
import Approvals from './Approvals';

export const pages: Record<string, ComponentType> = {
  'dashboard': Dashboard,
  profile: Profile,
  'agents': Agents,
  'tickets': Tickets,
  'reassign': Reassign,
  'escalations': Escalations,
  'performance': Performance,
  'sla-compliance': SlaCompliance,
  'approvals': Approvals,
};

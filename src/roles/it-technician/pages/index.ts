import type { ComponentType } from 'react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import TechnicalTickets from './TechnicalTickets';
import HardwareMaintenance from './HardwareMaintenance';
import SoftwareTroubleshoot from './SoftwareTroubleshoot';
import NetworkIssues from './NetworkIssues';
import Repairs from './Repairs';
import Reports from './Reports';
import EscalateIssues from './EscalateIssues';
import Assets from './Assets';

export const pages: Record<string, ComponentType> = {
  'dashboard': Dashboard,
  profile: Profile,
  'technical-tickets': TechnicalTickets,
  'hardware-maintenance': HardwareMaintenance,
  'software-troubleshoot': SoftwareTroubleshoot,
  'network-issues': NetworkIssues,
  'repairs': Repairs,
  'reports': Reports,
  'escalate-issues': EscalateIssues,
  'assets': Assets,
};

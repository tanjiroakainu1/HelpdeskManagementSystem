import type { ComponentType } from 'react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import MyTickets from './MyTickets';
import RespondInquiries from './RespondInquiries';
import Troubleshoot from './Troubleshoot';
import UpdateStatus from './UpdateStatus';
import TicketNotes from './TicketNotes';
import ResolveTicket from './ResolveTicket';
import Communicate from './Communicate';

export const pages: Record<string, ComponentType> = {
  'dashboard': Dashboard,
  profile: Profile,
  'my-tickets': MyTickets,
  'respond-inquiries': RespondInquiries,
  'troubleshoot': Troubleshoot,
  'update-status': UpdateStatus,
  'ticket-notes': TicketNotes,
  'resolve-ticket': ResolveTicket,
  'communicate': Communicate,
};

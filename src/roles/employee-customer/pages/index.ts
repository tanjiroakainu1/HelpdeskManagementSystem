import type { ComponentType } from 'react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Feedback from './Feedback';
import KnowledgeBase from './KnowledgeBase';
import MyTickets from './MyTickets';
import ReopenTicket from './ReopenTicket';
import SubmitTicket from './SubmitTicket';
import TicketMessages from './TicketMessages';
import TicketView from './TicketView';
import UploadDocuments from './UploadDocuments';

export const pages: Record<string, ComponentType> = {
  dashboard: Dashboard,
  profile: Profile,
  'submit-ticket': SubmitTicket,
  'my-tickets': MyTickets,
  'ticket-view': TicketView,
  'ticket-messages': TicketMessages,
  'upload-documents': UploadDocuments,
  'knowledge-base': KnowledgeBase,
  'reopen-ticket': ReopenTicket,
  feedback: Feedback,
};

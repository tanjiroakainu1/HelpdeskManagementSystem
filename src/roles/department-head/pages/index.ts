import type { ComponentType } from 'react';
import Approvals from './Approvals';
import CoordinateSupport from './CoordinateSupport';
import Dashboard from './Dashboard';
import Profile from './Profile';
import MonitorRequests from './MonitorRequests';
import Reports from './Reports';
import ReviewResolved from './ReviewResolved';
import TrackStatus from './TrackStatus';

export const pages: Record<string, ComponentType> = {
  dashboard: Dashboard,
  profile: Profile,
  'monitor-requests': MonitorRequests,
  approvals: Approvals,
  'track-status': TrackStatus,
  reports: Reports,
  'coordinate-support': CoordinateSupport,
  'review-resolved': ReviewResolved,
};

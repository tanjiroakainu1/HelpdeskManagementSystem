import type { ComponentType } from 'react';
import Activity from './Activity';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Departments from './Departments';
import Permissions from './Permissions';
import Reports from './Reports';
import Roles from './Roles';
import Settings from './Settings';
import SystemAccess from './SystemAccess';
import Users from './Users';

export const pages: Record<string, ComponentType> = {
  dashboard: Dashboard,
  profile: Profile,
  'system-access': SystemAccess,
  users: Users,
  roles: Roles,
  permissions: Permissions,
  settings: Settings,
  departments: Departments,
  reports: Reports,
  activity: Activity,
};

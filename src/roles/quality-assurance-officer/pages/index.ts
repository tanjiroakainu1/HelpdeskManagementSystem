import type { ComponentType } from 'react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Reviews from './Reviews';
import ServiceQuality from './ServiceQuality';
import EvaluatePerformance from './EvaluatePerformance';
import Satisfaction from './Satisfaction';
import Reports from './Reports';
import ProcessImprovements from './ProcessImprovements';

export const pages: Record<string, ComponentType> = {
  'dashboard': Dashboard,
  profile: Profile,
  'reviews': Reviews,
  'service-quality': ServiceQuality,
  'evaluate-performance': EvaluatePerformance,
  'satisfaction': Satisfaction,
  'reports': Reports,
  'process-improvements': ProcessImprovements,
};

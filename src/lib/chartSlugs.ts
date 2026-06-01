/** Pages that get the full analytics chart suite (in addition to dashboard). */
export const FULL_CHART_SLUGS = new Set([
  'reports',
  'performance',
  'operations',
  'sla',
  'sla-compliance',
  'service-quality',
  'compliance',
  'audit-reports',
  'system-access',
  'activity',
  'queues',
  'satisfaction',
  'evaluate-performance',
  'monitor-requests',
  'track-status',
  'technical-tickets',
  'tickets',
  'agents',
]);

/** Pages that get a compact 2–3 chart strip. */
export const COMPACT_CHART_SLUGS = new Set([
  'users',
  'roles',
  'departments',
  'assign-tickets',
  'my-tickets',
  'escalations',
  'approvals',
  'repairs',
  'assets',
  'activity-logs',
  'ticket-audit',
  'user-actions',
  'security-concerns',
  'knowledge-base',
  'publish-articles',
  'faqs',
  'reviews',
  'permissions',
  'hardware-maintenance',
  'network-issues',
  'software-troubleshoot',
]);

export const NO_CHART_SLUGS = new Set(['dashboard', 'profile', 'system-records']);

export function getChartLayout(slug: string): 'full' | 'compact' | 'mini' | null {
  if (NO_CHART_SLUGS.has(slug)) return null;
  if (FULL_CHART_SLUGS.has(slug)) return 'full';
  if (COMPACT_CHART_SLUGS.has(slug)) return 'compact';
  return 'mini';
}

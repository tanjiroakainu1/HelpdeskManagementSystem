import type { AppDatabase, Ticket, UserRole } from '@/types';
import { STATUS_COLORS, PRIORITY_COLORS, CHART_SERIES } from './chartTheme';

export type ChartPoint = { name: string; value: number; fill?: string };

export function ticketsByStatus(db: AppDatabase): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const t of db.tickets) {
    counts[t.status] = (counts[t.status] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
    fill: STATUS_COLORS[name] ?? CHART_SERIES[0],
  }));
}

export function ticketsByPriority(db: AppDatabase): ChartPoint[] {
  const order = ['low', 'medium', 'high', 'critical'];
  const counts: Record<string, number> = {};
  for (const t of db.tickets) {
    counts[t.priority] = (counts[t.priority] ?? 0) + 1;
  }
  return order
    .filter((p) => counts[p])
    .map((name) => ({
      name,
      value: counts[name],
      fill: PRIORITY_COLORS[name],
    }));
}

export function ticketsByCategory(db: AppDatabase): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const t of db.tickets) {
    counts[t.category] = (counts[t.category] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value], i) => ({
      name,
      value,
      fill: CHART_SERIES[i % CHART_SERIES.length],
    }));
}

export function ticketTrend(db: AppDatabase, days = 7): ChartPoint[] {
  const buckets: ChartPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString(undefined, { weekday: 'short' });
    const count = db.tickets.filter((t) => t.createdAt.slice(0, 10) === key).length;
    buckets.push({ name: label, value: count, fill: CHART_SERIES[0] });
  }
  return buckets;
}

export function ticketsByDepartment(db: AppDatabase): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const t of db.tickets) {
    const dept = db.departments.find((d) => d.id === t.departmentId);
    const name = dept?.name ?? 'Unassigned';
    counts[name] = (counts[name] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      name: name.length > 14 ? `${name.slice(0, 12)}…` : name,
      value,
      fill: CHART_SERIES[i % CHART_SERIES.length],
    }));
}

export function agentWorkload(db: AppDatabase): ChartPoint[] {
  const agents = db.users.filter((u) =>
    ['support_agent', 'it_technician', 'support_supervisor'].includes(u.role),
  );
  return agents
    .map((a, i) => ({
      name: a.fullName.split(' ')[0],
      value: db.tickets.filter(
        (t) => t.assignedTo === a.id && !['closed', 'resolved'].includes(t.status),
      ).length,
      fill: CHART_SERIES[i % CHART_SERIES.length],
    }))
    .sort((a, b) => b.value - a.value);
}

export function crudActivity(db: AppDatabase): ChartPoint[] {
  const ops: Record<string, number> = { create: 0, update: 0, delete: 0 };
  for (const r of db.systemRecords) {
    if (r.operation in ops) ops[r.operation]++;
  }
  return [
    { name: 'create', value: ops.create, fill: '#34d399' },
    { name: 'update', value: ops.update, fill: '#a78bfa' },
    { name: 'delete', value: ops.delete, fill: '#f87171' },
  ];
}

export function crudByEntity(db: AppDatabase): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const r of db.systemRecords) {
    counts[r.entityType] = (counts[r.entityType] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value], i) => ({
      name,
      value,
      fill: CHART_SERIES[i % CHART_SERIES.length],
    }));
}

export function feedbackRatings(db: AppDatabase): ChartPoint[] {
  const counts = [0, 0, 0, 0, 0];
  for (const f of db.feedback) {
    if (f.rating >= 1 && f.rating <= 5) counts[f.rating - 1]++;
  }
  return counts.map((value, i) => ({
    name: `${i + 1}★`,
    value,
    fill: i >= 3 ? '#34d399' : i >= 2 ? '#a78bfa' : '#f87171',
  }));
}

export function escalationBreakdown(db: AppDatabase): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const e of db.escalations) {
    counts[e.status] = (counts[e.status] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value], i) => ({
    name,
    value,
    fill: CHART_SERIES[i % CHART_SERIES.length],
  }));
}

export function repairStatus(db: AppDatabase): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const r of db.repairLogs) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value], i) => ({
    name,
    value,
    fill: CHART_SERIES[i % CHART_SERIES.length],
  }));
}

export function kbByStatus(db: AppDatabase): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const a of db.knowledgeArticles) {
    counts[a.status] = (counts[a.status] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value], i) => ({
    name,
    value,
    fill: CHART_SERIES[i % CHART_SERIES.length],
  }));
}

export function slaBreachGauge(db: AppDatabase): { ok: number; breach: number } {
  const now = Date.now();
  let breach = 0;
  let ok = 0;
  for (const t of db.tickets) {
    if (['closed', 'resolved'].includes(t.status)) {
      ok++;
      continue;
    }
    if (t.slaDueAt && new Date(t.slaDueAt).getTime() < now) breach++;
    else ok++;
  }
  return { ok, breach };
}

export function myTicketsByStatus(tickets: Ticket[]): ChartPoint[] {
  const counts: Record<string, number> = {};
  for (const t of tickets) {
    counts[t.status] = (counts[t.status] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
    fill: STATUS_COLORS[name] ?? CHART_SERIES[0],
  }));
}

export function roleActivityHeat(db: AppDatabase): ChartPoint[] {
  const roles: UserRole[] = [
    'super_admin',
    'help_desk_manager',
    'support_agent',
    'employee',
    'it_technician',
    'qa_officer',
  ];
  return roles.map((role, i) => ({
    name: role.replace(/_/g, ' '),
    value: db.systemRecords.filter((r) => r.userRole === role).length,
    fill: CHART_SERIES[i % CHART_SERIES.length],
  }));
}

/** Candy emerald × purple galaxy — Recharts palette */
export const CHART = {
  candy: '#34d399',
  candyLight: '#6ee7b7',
  candyMint: '#a7f3d0',
  candyDark: '#059669',
  galaxy: '#7c3aed',
  galaxySoft: '#a78bfa',
  galaxyDust: '#c4b5fd',
  violet: '#8b5cf6',
  pink: '#e879f9',
  amber: '#fbbf24',
  red: '#f87171',
  grid: 'rgba(91, 69, 133, 0.35)',
  axis: '#b4a8d4',
  tooltipBg: 'rgba(20, 13, 36, 0.95)',
  tooltipBorder: 'rgba(52, 211, 153, 0.35)',
} as const;

export const CHART_SERIES = [
  CHART.candy,
  CHART.galaxySoft,
  CHART.galaxy,
  CHART.candyLight,
  CHART.violet,
  CHART.pink,
  CHART.amber,
  CHART.candyDark,
];

export const STATUS_COLORS: Record<string, string> = {
  open: CHART.candyLight,
  assigned: CHART.galaxySoft,
  in_progress: CHART.galaxy,
  pending_approval: CHART.violet,
  escalated: CHART.red,
  resolved: CHART.candy,
  closed: CHART.galaxyDust,
  reopened: CHART.amber,
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: CHART.galaxyDust,
  medium: CHART.galaxySoft,
  high: CHART.candy,
  critical: CHART.red,
};

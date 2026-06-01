import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import { useChartHeight } from '@/hooks/useChartHeight';
import { ChartCard } from '@/components/charts/ChartCard';
import { ChartEmpty, hasChartData } from '@/components/charts/ChartEmpty';
import { ChartTooltip } from '@/components/charts/ChartTooltip';
import { useAppDb } from '@/hooks/useAppDb';
import {
  agentWorkload,
  crudActivity,
  crudByEntity,
  escalationBreakdown,
  feedbackRatings,
  kbByStatus,
  repairStatus,
  roleActivityHeat,
  slaBreachGauge,
  ticketTrend,
  ticketsByCategory,
  ticketsByDepartment,
  ticketsByPriority,
  ticketsByStatus,
} from '@/lib/chartData';
import { CHART, CHART_SERIES } from '@/lib/chartTheme';
import type { AppDatabase } from '@/types';

function filterDb(db: AppDatabase, requesterId?: number): AppDatabase {
  if (!requesterId) return db;
  const tickets = db.tickets.filter((t) => t.requesterId === requesterId);
  return { ...db, tickets };
}

export function HelpdeskCharts({
  layout = 'full',
  requesterId,
}: {
  layout?: 'full' | 'compact' | 'mini';
  requesterId?: number;
}) {
  const raw = useAppDb();
  const db = useMemo(() => filterDb(raw, requesterId), [raw, requesterId]);

  const status = useMemo(() => ticketsByStatus(db), [db]);
  const priority = useMemo(() => ticketsByPriority(db), [db]);
  const trend = useMemo(() => ticketTrend(db), [db]);
  const category = useMemo(() => ticketsByCategory(db), [db]);
  const departments = useMemo(() => ticketsByDepartment(db), [db]);
  const agents = useMemo(() => agentWorkload(db), [db]);
  const crudOps = useMemo(() => crudActivity(db), [db]);
  const crudEntities = useMemo(() => crudByEntity(db), [db]);
  const feedback = useMemo(() => feedbackRatings(db), [db]);
  const escalations = useMemo(() => escalationBreakdown(db), [db]);
  const repairs = useMemo(() => repairStatus(db), [db]);
  const kb = useMemo(() => kbByStatus(db), [db]);
  const roleHeat = useMemo(() => roleActivityHeat(db), [db]);
  const sla = useMemo(() => slaBreachGauge(db), [db]);

  const slaRadial = [
    { name: 'On track', value: sla.ok, fill: CHART.candy },
    { name: 'Breached', value: sla.breach, fill: CHART.red },
  ];

  const hMini = useChartHeight(160, { mobile: 140 });
  const hCompact = useChartHeight(220, { mobile: 190 });
  const hHero = useChartHeight(280, { mobile: 220, tablet: 250 });
  const hArea = useChartHeight(260, { mobile: 200, tablet: 230 });
  const hStd = useChartHeight(240, { mobile: 200, tablet: 220 });
  const hHeat = useChartHeight(220, { mobile: 200 });

  if (layout === 'mini') {
    return (
      <div className="chart-grid chart-grid--mini">
        <ChartCard title="Status mix" className="col-span-1">
          {hasChartData(status) ? (
            <ResponsiveContainer width="100%" height={hMini}>
              <PieChart>
                <Pie data={status} dataKey="value" nameKey="name" innerRadius={40} outerRadius={68} paddingAngle={2}>
                  {status.map((e, i) => (
                    <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty message="No tickets in view" />
          )}
        </ChartCard>
        <ChartCard title="7-day volume" className="col-span-1">
          {hasChartData(trend) ? (
            <ResponsiveContainer width="100%" height={hMini}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="miniTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.candy} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={CHART.galaxy} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={CHART.candy} fill="url(#miniTrend)" strokeWidth={2} />
                <Tooltip content={<ChartTooltip />} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ChartEmpty message="No tickets created this week" />
          )}
        </ChartCard>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="chart-grid chart-grid--compact">
        <ChartCard title="Ticket status" subtitle="Live system data">
          <ResponsiveContainer width="100%" height={hCompact}>
            <BarChart data={status} layout="vertical" margin={{ left: 4, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
              <XAxis type="number" stroke={CHART.axis} fontSize={11} />
              <YAxis type="category" dataKey="name" width={90} stroke={CHART.axis} fontSize={10} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {status.map((e, i) => (
                  <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Priority breakdown">
          <ResponsiveContainer width="100%" height={hCompact}>
            <PieChart>
              <Pie data={priority} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                {priority.map((e) => (
                  <Cell key={e.name} fill={e.fill!} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: CHART.axis }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="CRUD activity" className="col-span-full sm:col-span-1">
          <ResponsiveContainer width="100%" height={hCompact}>
            <BarChart data={crudOps}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
              <YAxis stroke={CHART.axis} fontSize={11} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {crudOps.map((e) => (
                  <Cell key={e.name} fill={e.fill!} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    );
  }

  return (
    <section className="chart-section" aria-label="Analytics charts">
      <div className="chart-section-head">
        <h2 className="chart-section-title">Live analytics</h2>
        <p className="chart-section-desc">Real-time analytics across tickets, SLA, and operations</p>
      </div>

      <div className="chart-grid chart-grid--full">
        <ChartCard title="Ticket galaxy" subtitle="Status distribution" className="chart-card--hero" tall>
          <ResponsiveContainer width="100%" height={hHero}>
            <PieChart>
              <Pie
                data={status}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={115}
                paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: CHART.axis }}
              >
                {status.map((e) => (
                  <Cell key={e.name} fill={e.fill!} stroke="rgba(10,6,20,0.8)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="SLA pulse" subtitle="On track vs breach" tall>
          <ResponsiveContainer width="100%" height={hHero}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="95%" data={slaRadial} startAngle={180} endAngle={0}>
              <RadialBar background={{ fill: 'rgba(124,58,237,0.15)' }} dataKey="value" cornerRadius={10} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ color: CHART.axis }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Volume nebula" subtitle="New tickets — last 7 days" className="col-span-full" tall>
          <ResponsiveContainer width="100%" height={hArea}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.candy} stopOpacity={0.55} />
                  <stop offset="50%" stopColor={CHART.galaxy} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={CHART.galaxy} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
              <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke={CHART.candyLight} fill="url(#trendFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Priority spectrum">
          <ResponsiveContainer width="100%" height={hStd}>
            <BarChart data={priority}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
              <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {priority.map((e) => (
                  <Cell key={e.name} fill={e.fill!} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category clusters">
          <ResponsiveContainer width="100%" height={hStd}>
            <BarChart data={category}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" stroke={CHART.axis} fontSize={10} angle={-20} textAnchor="end" height={50} />
              <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {category.map((e, i) => (
                  <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {!requesterId && (
          <>
            <ChartCard title="Agent constellation" subtitle="Open assignments">
              <ResponsiveContainer width="100%" height={hStd}>
                <BarChart data={agents}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
                  <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {agents.map((e, i) => (
                      <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Department orbit">
              <ResponsiveContainer width="100%" height={hStd}>
                <LineChart data={departments}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis dataKey="name" stroke={CHART.axis} fontSize={10} />
                  <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="value" stroke={CHART.galaxySoft} strokeWidth={3} dot={{ fill: CHART.candy, r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        <ChartCard title="CRUD supernova" subtitle="System-wide operations">
          <ResponsiveContainer width="100%" height={hStd}>
            <BarChart data={crudOps}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
              <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {crudOps.map((e) => (
                  <Cell key={e.name} fill={e.fill!} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Entity activity" subtitle="Records by type">
          <ResponsiveContainer width="100%" height={hStd}>
            <PieChart>
              <Pie data={crudEntities} dataKey="value" nameKey="name" outerRadius={90} label>
                {crudEntities.map((e, i) => (
                  <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {!requesterId && feedback.some((f) => f.value > 0) && (
          <ChartCard title="Satisfaction stars">
            <ResponsiveContainer width="100%" height={hStd}>
              <BarChart data={feedback}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
                <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {feedback.map((e) => (
                    <Cell key={e.name} fill={e.fill!} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {escalations.length > 0 && (
          <ChartCard title="Escalation waves">
            <ResponsiveContainer width="100%" height={hStd}>
              <PieChart>
                <Pie data={escalations} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={4}>
                  {escalations.map((e, i) => (
                    <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {repairs.length > 0 && (
          <ChartCard title="Repair status">
            <ResponsiveContainer width="100%" height={hStd}>
              <BarChart data={repairs} layout="vertical" margin={{ left: 4, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
                <XAxis type="number" stroke={CHART.axis} fontSize={11} />
                <YAxis type="category" dataKey="name" width={72} stroke={CHART.axis} fontSize={10} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {repairs.map((e, i) => (
                    <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {kb.length > 0 && (
          <ChartCard title="Knowledge base">
            <ResponsiveContainer width="100%" height={hStd}>
              <PieChart>
                <Pie data={kb} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                  {kb.map((e, i) => (
                    <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: CHART.axis }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {!requesterId && (
          <ChartCard title="Role heat map" subtitle="System record volume" className="col-span-full">
            <ResponsiveContainer width="100%" height={hHeat}>
              <BarChart data={roleHeat}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="name" stroke={CHART.axis} fontSize={10} angle={-15} textAnchor="end" height={56} />
                <YAxis stroke={CHART.axis} fontSize={11} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {roleHeat.map((e, i) => (
                    <Cell key={e.name} fill={e.fill ?? CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </section>
  );
}

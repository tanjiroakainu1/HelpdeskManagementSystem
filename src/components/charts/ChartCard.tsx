import type { ReactNode } from 'react';

export function ChartCard({
  title,
  subtitle,
  children,
  className = '',
  tall = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  tall?: boolean;
}) {
  return (
    <div className={`chart-card ${tall ? 'chart-card--tall' : ''} ${className}`.trim()}>
      <div className="chart-card-header">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="chart-card-body">{children}</div>
    </div>
  );
}

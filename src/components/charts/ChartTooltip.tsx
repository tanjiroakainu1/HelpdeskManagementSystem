import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip-label">{label}</p>}
      {payload.map((p) => (
        <p key={String(p.name)} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: p.color ?? p.payload?.fill }} />
          <span>{p.name}</span>
          <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

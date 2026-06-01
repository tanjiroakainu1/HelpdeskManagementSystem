export function ChartEmpty({ message = 'No data yet' }: { message?: string }) {
  return (
    <div className="chart-empty" role="status">
      <span className="chart-empty__icon" aria-hidden>
        📊
      </span>
      <p>{message}</p>
    </div>
  );
}

export function hasChartData(points: { value: number }[]): boolean {
  return points.some((p) => p.value > 0);
}

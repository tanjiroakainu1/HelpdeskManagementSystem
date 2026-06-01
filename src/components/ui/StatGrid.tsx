export function StatGrid({
  items,
}: {
  items: { label: string; value: string | number; accent?: boolean; danger?: boolean }[];
}) {
  const count = items.length;
  const gridClass =
    count <= 2
      ? 'grid-cols-1 min-[400px]:grid-cols-2'
      : count === 3
        ? 'grid-cols-1 min-[400px]:grid-cols-3'
        : count === 4
          ? 'grid-cols-2 lg:grid-cols-4'
          : count === 5
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6';

  return (
    <div className={`stat-grid mb-6 sm:mb-8 ${gridClass}`}>
      {items.map((item, i) => (
        <div
          key={item.label}
          className={
            item.danger
              ? 'stat-card-danger stat-card'
              : item.accent
                ? 'stat-card-accent stat-card'
                : 'stat-card-default stat-card'
          }
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="stat-card-value">{item.value}</div>
          <div className="stat-card-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

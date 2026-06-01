export function EmptyState({
  title = 'Nothing here yet',
  description,
  icon = '📋',
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon" aria-hidden>
        {icon}
      </span>
      <p className="font-display text-base font-semibold text-white">{title}</p>
      {description && <p className="empty-state-desc">{description}</p>}
    </div>
  );
}

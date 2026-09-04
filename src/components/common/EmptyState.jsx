/**
 * Neutral placeholder for "there is nothing to show yet" situations
 * (no city searched, no favorites, no forecast matches a filter, …).
 */
export function EmptyState({ icon: Icon, title, hint, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-xl border border-dashed border-subtle-border bg-raised/40 px-6 py-10 text-center ${className}`}
    >
      {Icon ? (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-raised text-subtle">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : null}
      <p className="text-sm font-semibold text-content">{title}</p>
      {hint ? <p className="max-w-sm text-sm text-muted">{hint}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

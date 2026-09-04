/**
 * KPI card — a single headline metric. Used by the Statistics section.
 * icon chip + small uppercase label, a large tabular value, and an optional
 * secondary line (e.g. which day, or the time range).
 *
 * `tone` is a colour-chip class (see `constants/iconTones`) so each KPI reads
 * as its own metric at a glance instead of six identical grey icons.
 */
export function DetailTile({ icon: Icon, label, value, sublabel, tone = 'bg-subtle/10 text-subtle' }) {
  return (
    <div className="rounded-2xl border border-subtle-border bg-surface p-4 shadow-soft">
      <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wide text-subtle">
        {Icon ? (
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${tone}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums text-content">{value}</p>
      {sublabel ? <p className="mt-0.5 text-xs text-muted">{sublabel}</p> : null}
    </div>
  );
}

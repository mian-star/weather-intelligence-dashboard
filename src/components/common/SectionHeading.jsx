/**
 * Consistent section title with an optional leading icon and a right-aligned
 * slot for controls. Renders an <h2> by default; pass `as` to change the level.
 *
 * `tone` is optional — a colour-chip class from `constants/iconTones`. Without
 * it the icon renders exactly as before (a bare, neutral glyph), so existing
 * callers are unaffected; pass it to give a specific heading its own accent.
 */
export function SectionHeading({ as: Heading = 'h2', title, description, actions, icon: Icon, tone }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon ? (
          tone ? (
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          ) : (
            <Icon className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
          )
        ) : null}
        <div>
          <Heading className="text-base font-semibold tracking-tight text-content">
            {title}
          </Heading>
          {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

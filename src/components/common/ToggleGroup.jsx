/**
 * Labelled group of side-by-side toggle buttons — a radio-style alternative to
 * `Select` with the same API shape (`label`/`value`/`onChange`/`options`/
 * `hideLabel`), so it drops into a form the same way. Reuses the active/
 * inactive styling already established by the header's `UnitToggle`.
 */
export function ToggleGroup({
  id,
  label,
  value,
  onChange,
  options,
  hideLabel = false,
  className = '',
}) {
  return (
    <div className={className}>
      <span
        id={id ? `${id}-label` : undefined}
        className={
          hideLabel
            ? 'sr-only'
            : 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle'
        }
      >
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={id ? `${id}-label` : undefined}
        aria-label={id ? undefined : label}
        className="flex overflow-hidden rounded-lg border border-subtle-border text-sm"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-3 py-2 font-semibold transition-colors ${
              value === option.value
                ? 'bg-brand text-brand-contrast'
                : 'bg-surface text-muted hover:text-content'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

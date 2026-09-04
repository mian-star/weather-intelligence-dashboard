/**
 * Labelled <select>. The label is always rendered (visually hidden when
 * `hideLabel` is set) so every control has an accessible name.
 */
export function Select({
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
      <label
        htmlFor={id}
        className={
          hideLabel
            ? 'sr-only'
            : 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle'
        }
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-subtle-border bg-surface px-3 py-2 text-sm font-medium text-content transition-colors hover:border-brand/60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

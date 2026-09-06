/**
 * Labelled checkbox. A real `<input type="checkbox">` (not a styled button),
 * so it behaves like a native form control — label click toggles it, and it
 * reports `event.target.checked` like any other checkbox change event.
 */
export function Checkbox({ id, label, description, checked, onChange, className = '' }) {
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-2.5 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-subtle-border text-brand accent-brand"
      />
      <span>
        <span className="block text-sm font-medium text-content">{label}</span>
        {description ? <span className="block text-xs text-muted">{description}</span> : null}
      </span>
    </label>
  );
}

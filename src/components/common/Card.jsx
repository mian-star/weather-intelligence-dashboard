/**
 * Generic surface container used by most sections.
 * `as` lets callers render it as a <section>, <article>, etc. for semantics.
 * `tone` picks the visual weight:
 *   - "panel"  (default) a white surface with a hairline border and soft shadow
 *   - "quiet"  no border/shadow — a plain grouping that just adds padding
 */
const TONES = {
  panel: 'border border-subtle-border bg-surface shadow-soft',
  quiet: 'bg-transparent',
};

export function Card({ as: Component = 'div', tone = 'panel', className = '', children, ...rest }) {
  return (
    <Component
      className={`rounded-2xl p-4 sm:p-5 ${TONES[tone] ?? TONES.panel} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}

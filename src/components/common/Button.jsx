const VARIANTS = {
  primary:
    'bg-brand text-brand-contrast shadow-soft hover:bg-brand-strong disabled:opacity-50',
  secondary:
    'border border-subtle-border bg-surface text-content hover:bg-raised disabled:opacity-50',
  ghost: 'text-muted hover:bg-raised hover:text-content disabled:opacity-50',
  danger:
    'border border-danger/40 text-danger hover:bg-danger/10 disabled:opacity-50',
};

/**
 * Shared button. Always a real <button> so keyboard and screen-reader users get
 * native behaviour for free.
 */
export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

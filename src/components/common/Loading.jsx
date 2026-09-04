import { Loader2 } from 'lucide-react';

/**
 * Inline loading indicator for a single section. `label` should say what is
 * loading ("Loading weather…", "Searching…").
 */
export function Loading({ label = 'Loading…', className = '' }) {
  return (
    <div
      role="status"
      className={`flex items-center gap-3 text-sm font-medium text-muted ${className}`}
    >
      <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

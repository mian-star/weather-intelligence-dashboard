import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

/**
 * Friendly error panel. Never shows a raw exception — callers pass a
 * human-readable message. An optional retry callback renders a button.
 */
export function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-2xl border border-danger/30 bg-danger/10 p-5 text-sm text-content"
    >
      <div className="flex items-center gap-2 font-semibold text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        <span>{title}</span>
      </div>
      {message ? <p className="text-muted">{message}</p> : null}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

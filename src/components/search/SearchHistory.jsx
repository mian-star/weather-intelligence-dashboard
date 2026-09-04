import { ChevronRight, History } from 'lucide-react';
import { ICON_TONES } from '../../constants/iconTones';
import { Card } from '../common/Card';
import { SectionHeading } from '../common/SectionHeading';

/**
 * Recent searches (max 5, newest first) — a standalone dashboard column.
 * Separate from favorites: this is "where have I looked recently", not "what did
 * I save". Rows are clickable and re-select that location.
 */
export function SearchHistory({ history, onSelect, onClear }) {
  const items = history ?? [];

  return (
    <Card as="section" aria-label="Recent searches" className="h-full">
      <SectionHeading
        title="Recent Searches"
        icon={History}
        tone={ICON_TONES.history}
        actions={
          items.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-muted transition-colors hover:text-danger"
            >
              Clear history
            </button>
          ) : null
        }
      />

      {items.length === 0 ? (
        <p className="rounded-lg bg-raised/50 px-3 py-6 text-center text-sm text-muted">
          No recent searches yet.
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((location) => (
            <li key={location.id}>
              <button
                type="button"
                onClick={() => onSelect(location)}
                className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-raised"
              >
                <span className="min-w-0 flex-1 truncate font-medium text-content">
                  {location.name}
                  {location.country ? (
                    <span className="text-subtle">
                      {', '}
                      {location.country}
                    </span>
                  ) : null}
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

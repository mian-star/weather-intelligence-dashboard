import { SearchX } from 'lucide-react';
import { ApiError } from '../../services/openMeteoClient';
import { EmptyState } from '../common/EmptyState';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loading } from '../common/Loading';
import { LocationCard } from './LocationCard';

/**
 * Search results shown as a dropdown panel anchored under the search field.
 * Renders whichever state the search is in: loading, error, empty, or a list of
 * results. Returns null when the search is idle so the panel disappears.
 * The parent wraps <SearchBar> + <SearchResults> in a `relative` container.
 */
export function SearchResults({ results, isLoading, error, lastTerm, onSelect }) {
  const hasContent = isLoading || error || (lastTerm && results.length === 0) || results.length > 0;
  if (!hasContent) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-subtle-border bg-surface p-2 shadow-float">
      {isLoading ? (
        <Loading label="Searching…" className="px-2 py-2" />
      ) : error ? (
        <ErrorMessage
          title="Search failed"
          message={
            error instanceof ApiError
              ? error.message
              : 'We could not run that search. Check your connection and try again.'
          }
        />
      ) : lastTerm && results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title={`No results for "${lastTerm}"`}
          hint="Check the spelling or try a nearby larger city."
        />
      ) : (
        <ul className="space-y-1">
          {results.map((location) => (
            <LocationCard key={location.id} location={location} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { MAX_SEARCH_TERM_LENGTH } from '../../constants/preferences';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { isValidSearchTerm, normaliseSearchTerm } from '../../utils/validation';

/**
 * Controlled city search input.
 *
 * - The input value is React state (`term`).
 * - Submitting the form validates + trims, then calls `onSearch`.
 * - A debounced copy of the term triggers `onSearch` automatically once it is
 *   at least 3 characters, so we search as the user pauses typing without
 *   firing a request on every keystroke.
 * - The typed text is cleared once a result has been selected by giving this
 *   component a fresh `key` from the parent (the recommended React pattern
 *   for resetting a component's state — see react.dev/learn/you-might-not-need-an-effect
 *   — rather than an effect that calls setState on a "reset" prop change).
 */
export function SearchBar({ onSearch, autoFocus = false }) {
  const [term, setTerm] = useState('');
  const [validationError, setValidationError] = useState('');
  const debouncedTerm = useDebouncedValue(term, 450);

  useEffect(() => {
    const trimmed = normaliseSearchTerm(debouncedTerm);
    if (trimmed.length >= 3 && isValidSearchTerm(trimmed)) {
      onSearch(trimmed);
    }
  }, [debouncedTerm, onSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = normaliseSearchTerm(term);
    if (!trimmed) {
      setValidationError('Enter a city name to search.');
      return;
    }
    if (trimmed.length > MAX_SEARCH_TERM_LENGTH) {
      setValidationError('That name is too long.');
      return;
    }
    setValidationError('');
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <label
        htmlFor="city-search"
        className="mb-2 block text-sm font-semibold text-content"
      >
        Search for a city
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          />
          <input
            id="city-search"
            type="text"
            value={term}
            autoFocus={autoFocus}
            maxLength={MAX_SEARCH_TERM_LENGTH}
            onChange={(event) => {
              setTerm(event.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && term) {
                setTerm('');
                setValidationError('');
              }
            }}
            placeholder="Search city, region or country…"
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'city-search-error' : undefined}
            className="w-full rounded-xl border border-subtle-border bg-surface py-2.5 pl-10 pr-3 text-sm text-content transition-colors placeholder:text-subtle hover:border-brand/50"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast shadow-soft transition-[background-color,transform] duration-150 hover:bg-brand-strong active:scale-[0.97]"
        >
          Search
        </button>
      </div>
      {validationError ? (
        <p id="city-search-error" className="mt-1.5 text-sm font-medium text-danger">
          {validationError}
        </p>
      ) : null}
    </form>
  );
}

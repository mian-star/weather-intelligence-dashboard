import { useCallback, useEffect, useRef, useState } from 'react';
import { searchLocations } from '../services/geocodingService';
import { isAbortError } from '../services/openMeteoClient';
import { isValidSearchTerm, normaliseSearchTerm } from '../utils/validation';

/**
 * Runs a geocoding search and manages its loading / error / results state.
 *
 * A ref holds the current AbortController so that starting a new search (or the
 * component unmounting) cancels the previous request — the "cancel an old
 * request when the user starts another search" requirement.
 */
export function useLocationSearch() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastTerm, setLastTerm] = useState('');
  const controllerRef = useRef(null);

  const runSearch = useCallback((rawTerm) => {
    const term = normaliseSearchTerm(rawTerm);
    if (!isValidSearchTerm(term)) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setLastTerm(term);

    searchLocations(term, { signal: controller.signal })
      .then((found) => {
        setResults(found);
        setIsLoading(false);
      })
      .catch((err) => {
        if (isAbortError(err)) return;
        setError(err);
        setResults([]);
        setIsLoading(false);
      });
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setResults([]);
    setError(null);
    setIsLoading(false);
    setLastTerm('');
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { results, isLoading, error, lastTerm, runSearch, reset };
}

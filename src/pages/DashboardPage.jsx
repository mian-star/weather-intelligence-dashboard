import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CloudSun, MapPinned } from 'lucide-react';
import { DetectLocationButton } from '../components/search/DetectLocationButton';
import { SearchBar } from '../components/search/SearchBar';
import { SearchHistory } from '../components/search/SearchHistory';
import { SearchResults } from '../components/search/SearchResults';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Loading } from '../components/common/Loading';
import { CurrentWeather } from '../components/weather/CurrentWeather';
import { Forecast } from '../components/weather/Forecast';
import { HourlyWeather } from '../components/weather/HourlyWeather';
import { Statistics } from '../components/weather/Statistics';
import { WeatherDetails } from '../components/weather/WeatherDetails';
import { useLocation } from '../context/locationContext';
import { useLocationSearch } from '../hooks/useLocationSearch';
import { useWeather } from '../hooks/useWeather';
import { searchLocations } from '../services/geocodingService';
import { formatUpdatedAt } from '../utils/datetime';
import { parseCoordinate } from '../utils/validation';

// The chart pulls in Recharts (the biggest dependency) and sits below the fold,
// so it is code‑split and loaded on demand.
const TemperatureChart = lazy(() =>
  import('../components/weather/TemperatureChart').then((module) => ({
    default: module.TemperatureChart,
  })),
);

const TODAY_LABEL = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date());

/**
 * The dashboard route. Owns the wiring between:
 *  - the URL query params (?city= / ?lat=&lon=)
 *  - the selected location (LocationContext)
 *  - the weather request (useWeather)
 *  - the search UI (useLocationSearch)
 *
 * The page is laid out as a 12-column grid (single column below `md`): a full
 * width header + search, an 8/4 "current weather + recent searches" row, a full
 * width KPI row, an 8/4 "hourly + details" row, then the full width chart and
 * 7-day forecast.
 */
export function DashboardPage() {
  const { selectedLocation, searchHistory, selectLocation, clearHistory } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { results, isLoading: isSearching, error: searchError, lastTerm, runSearch, reset } =
    useLocationSearch();
  const { weather, isLoading, error, refetch } = useWeather(selectedLocation);
  const [urlError, setUrlError] = useState('');
  const [searchResetToken, setSearchResetToken] = useState(0);

  // Choose a location and reflect it in the URL so the view is shareable.
  // Named results (from geocoding) get ?city=; coordinate-only results (a
  // detected location) get ?lat=&lon= so the link still resolves.
  const chooseLocation = useCallback(
    (location) => {
      selectLocation(location);
      reset();
      setSearchResetToken((token) => token + 1); // clears the SearchBar's typed text
      setUrlError('');
      const params = location?.country
        ? { city: location.name }
        : { lat: String(location.latitude), lon: String(location.longitude) };
      setSearchParams(params, { replace: true });
    },
    [selectLocation, reset, setSearchParams],
  );

  // One-time initialisation from the URL. Runs before falling back to the
  // last-selected location that LocationContext restored from LocalStorage.
  const initialisedRef = useRef(false);
  useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;

    const lat = parseCoordinate(searchParams.get('lat'));
    const lon = parseCoordinate(searchParams.get('lon'));
    const city = searchParams.get('city');

    if (lat !== null && lon !== null) {
      selectLocation({ name: city || 'Pinned location', latitude: lat, longitude: lon });
      return;
    }

    if (city) {
      searchLocations(city)
        .then((found) => {
          if (found[0]) selectLocation(found[0]);
          else setUrlError(`Could not find "${city}" from the link.`);
        })
        .catch(() => setUrlError('Could not load the location from the link.'));
    }
    // No params: keep whatever LocationContext already restored.
  }, [searchParams, selectLocation]);

  const handleDetected = (coords) => {
    chooseLocation({ name: 'My location', latitude: coords.latitude, longitude: coords.longitude });
  };

  const weatherReady = selectedLocation && !isLoading && !error && weather;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start md:gap-5">
      {/* Page header */}
      <header className="flex flex-wrap items-end justify-between gap-3 md:col-span-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-content sm:text-[1.75rem]">
            Weather Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Monitor current conditions and upcoming weather
          </p>
        </div>
        <div className="text-left text-xs text-muted sm:text-right">
          <p className="font-semibold text-content">{TODAY_LABEL}</p>
          {weather?.current?.observedAt ? (
            <p>Updated {formatUpdatedAt(weather.current.observedAt)}</p>
          ) : null}
        </div>
      </header>

      {/* Search */}
      <Card as="section" aria-label="Location search" className="md:col-span-12">
        <div className="relative">
          <SearchBar
            key={searchResetToken}
            onSearch={runSearch}
            autoFocus={!selectedLocation}
          />
          <SearchResults
            results={results}
            isLoading={isSearching}
            error={searchError}
            lastTerm={lastTerm}
            onSelect={chooseLocation}
          />
        </div>
        <DetectLocationButton onLocated={handleDetected} />
      </Card>

      {urlError ? (
        <div className="md:col-span-12">
          <ErrorMessage title="Link problem" message={urlError} />
        </div>
      ) : null}

      {/* Row 1 — current weather (8) + recent searches (4) */}
      <div className="md:col-span-8">
        {!selectedLocation ? (
          <EmptyState
            icon={CloudSun}
            title="No location selected"
            hint="Search for a city above, pick a recent search, or use your current location."
          />
        ) : isLoading ? (
          <Card>
            <Loading label={`Loading weather for ${selectedLocation.name}…`} />
          </Card>
        ) : error ? (
          <ErrorMessage
            title="Could not load weather"
            message="The weather service did not respond. Check your connection and try again."
            onRetry={refetch}
          />
        ) : weather?.current ? (
          <CurrentWeather
            current={weather.current}
            location={selectedLocation}
            today={weather.daily[0]}
          />
        ) : weather ? (
          <EmptyState icon={MapPinned} title="No current weather for this location" />
        ) : null}
      </div>

      <div className="md:col-span-4">
        <SearchHistory history={searchHistory} onSelect={chooseLocation} onClear={clearHistory} />
      </div>

      {/* Everything below only once the forecast has loaded */}
      {weatherReady ? (
        <>
          {weather.daily.length > 0 ? (
            <div className="md:col-span-12">
              <Statistics days={weather.daily} />
            </div>
          ) : (
            <div className="md:col-span-12">
              <EmptyState title="No forecast available for this location" />
            </div>
          )}

          {weather.hourly.length > 0 ? (
            <div className="md:col-span-8">
              <HourlyWeather hourly={weather.hourly} />
            </div>
          ) : null}

          {weather.details ? (
            <div className="md:col-span-4">
              <WeatherDetails details={weather.details} />
            </div>
          ) : null}

          {weather.hourly.length > 0 ? (
            <div className="md:col-span-12">
              <Suspense fallback={<Card><Loading label="Loading chart…" /></Card>}>
                <TemperatureChart hourly={weather.hourly} />
              </Suspense>
            </div>
          ) : null}

          {weather.daily.length > 0 ? (
            <div className="md:col-span-12">
              <Forecast days={weather.daily} />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

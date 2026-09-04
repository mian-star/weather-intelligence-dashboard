# Weather Intelligence Dashboard

A responsive, frontend-only weather dashboard built with React. Search for any
city, pick a result, and view current conditions, a 7‑day forecast, an hourly
breakdown, weather statistics and a trend chart — all from the free
[Open‑Meteo](https://open-meteo.com) API. Preferences, favorites and search
history are persisted in the browser.

---

## Features

**Locations**
- City search (geocoding API) with validation, trimming, debounced auto‑search and an explicit submit
- Search results show name, administrative region, country and coordinates
- Selecting a result loads its weather and updates the URL (`?city=…`)
- "Use my current location" via the browser Geolocation API (optional, never forced)
- Recent searches (last 5, no consecutive duplicates, selectable, clearable)
- Favorite locations (add / remove / no duplicates / select), separate from history

**Weather**
- Current weather: temperature, feels‑like, condition, wind speed + direction, humidity, precipitation, pressure, icon, last‑updated time
- Weather details: humidity, wind, wind direction, precipitation, UV index, sunrise, sunset, cloud cover, pressure
- 7‑day forecast day cards: day name, date, min/max, condition, precipitation, sunrise, sunset, plus a temperature‑range bar (horizontal scroll on small screens, a grid on wider ones)
- Forecast filtering (rainy days / any precipitation / hot days above a threshold / strong wind) and sorting (temperature, wind, precipitation)
- Hourly weather with a Today / Tomorrow / day picker: time, temperature, feels‑like, precipitation, wind, condition
- Weather statistics computed from the forecast: highest / lowest / average temperature, total precipitation, max wind speed, rainy‑day count
- Hourly trend chart with a temperature / precipitation / wind toggle
- Compare two saved locations side by side

**App**
- Celsius / Fahrenheit toggle — updates every temperature instantly, no reload
- Light / dark theme, persisted
- Settings form (controlled inputs, validation, submit, reset)
- Client‑side routing: `/weather`, `/favorites`, `/compare`, `/settings` (no full page reloads)
- Loading, error and empty states for every async operation
- Responsive layout (390 → 1920 px), semantic HTML, keyboard‑navigable, visible focus rings

---

## Technology stack

| Area | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite |
| Language | JavaScript (JSX), modern ES2020+ |
| Styling | Tailwind CSS v4 (class‑based dark mode, semantic colour tokens) |
| Routing | React Router (`react-router-dom`) |
| Charts | Recharts |
| Icons | lucide-react |
| Data | Open‑Meteo Geocoding + Forecast APIs (no key, no backend) |
| Persistence | Browser LocalStorage |

No backend, database or auth — this is a frontend‑only project.

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Production build / preview
npm run build
npm run preview

# 4. Lint
npm run lint
```

No environment variables are required — Open‑Meteo needs no API key for
non‑commercial use.

---

## API

**Geocoding** — `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=8&language=en&format=json`
Returns location name, latitude, longitude, country, country code, admin region, timezone, population.

**Forecast** — `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=…&hourly=…&daily=…&timezone=auto&forecast_days=7`
Always requested in metric (°C, km/h, mm); unit conversion happens on the client.

The exact field lists live in [`src/constants/api.js`](src/constants/api.js).
All URL building and fetching is in [`src/services/`](src/services/) — components
never construct a URL.

---

## Folder structure

```
src/
  components/
    common/      Reusable UI: Card, Button, Select, Loading, ErrorMessage,
                 EmptyState, SectionHeading, DetailTile, TemperatureValue,
                 UnitToggle, ThemeToggle, FavoritesIndicator
    layout/      Layout, Header, Navigation
    search/      SearchBar, SearchResults, LocationCard, SearchHistory,
                 DetectLocationButton
    weather/     CurrentWeather, WeatherDetails, Forecast, ForecastControls,
                 ForecastCard, HourlyWeather, HourlyDaySelector,
                 HourlyWeatherRow, Statistics, TemperatureChart, WeatherIcon
    favorites/   Favorites, FavoriteCard, FavoriteButton
    comparison/  ComparisonView, ComparisonColumn
    settings/    SettingsForm
  hooks/         useLocalStorage, useWeather, useLocationSearch,
                 useGeolocation, useDebouncedValue
  services/      openMeteoClient (fetch + typed errors), geocodingService,
                 forecastService
  utils/         temperature, wind, weatherCodes, statistics, datetime,
                 forecast (filter/sort), validation, storage, transform, location
  context/       PreferencesProvider / preferencesContext,
                 LocationProvider / locationContext
  pages/         DashboardPage, FavoritesPage, ComparePage, SettingsPage,
                 NotFoundPage
  constants/     api, preferences, forecast
  App.jsx        providers + routes
  main.jsx       BrowserRouter + root render
```

**Why this structure:** UI is grouped by feature (`weather/`, `favorites/`,
`search/`, `settings/`, `comparison/`) with a shared `common/` bucket for
primitives used everywhere. Non‑visual concerns are separated into their own
layers — `services/` (I/O), `utils/` (pure logic), `hooks/` (stateful logic),
`context/` (shared state) — so any of them can be read, tested or replaced in
isolation.

---

## Architecture

```
User
  ↓  interacts with
React components (pages + feature components)
  ↓  call
Custom hooks (useWeather, useLocationSearch, useLocalStorage, …)
  ↓  call
Service layer (geocodingService, forecastService → openMeteoClient)
  ↓  fetch
Open‑Meteo API  →  JSON response
  ↓  passed to
Transform layer (utils/transform.js: parallel arrays → app objects)
  ↓  stored in
React state (hook state + context)
  ↓  rendered by
UI  (derived values — filters, sorting, statistics, unit conversion —
     are computed during render, never stored)
```

See [`docs/architecture.md`](docs/architecture.md) for the diagram.

**Data flow** is one‑directional: a service returns raw JSON → the transform
layer turns it into the app's own objects → a hook holds it in state → the page
passes it down as props → a child fires a callback → state updates → the UI
re‑renders with new derived values.

---

## State management

React `useState` + Context. No Redux — the app has one genuinely global slice
(preferences) and one shared slice (the active location + collections), which
Context handles without extra machinery.

| State | Owner | Read by | Updated by | Why there |
|---|---|---|---|---|
| `temperatureUnit`, `windUnit`, `theme` | `PreferencesProvider` (context) | every temperature/wind display, Header, Settings | Header toggles, `SettingsForm` | consumed app‑wide; a unit change must re‑render every display with no reload |
| `selectedLocation` | `LocationProvider` (context) | every dashboard section, Compare | Search, History, Favorites, URL param, Geolocation | set from many sibling sources, read by many |
| `favorites`, `searchHistory` | `LocationProvider` (context) | Header badge, Favorites page, `FavoriteButton`, Search | `addFavorite` / `removeFavorite` / `selectLocation` / `clearHistory` | shared across unrelated parts of the tree; kept as **two separate arrays** because they are different concepts |
| search input value | `SearchBar` | — | `onChange` | only that form cares |
| `weather` / `isLoading` / `error` | `useWeather` (in `DashboardPage`) | dashboard sections | the fetch effect | async resource tied to the selected location |
| `filter` / `hotThreshold` / `sort` | `Forecast` | that section only | filter/sort controls | local view state |
| `selectedDayIndex` | `HourlyWeather` | that section only | day selector | local view state |
| `metric` | `TemperatureChart` | that chart only | metric select | local view state |
| draft form fields | `SettingsForm` | that form only | field `onChange` | uncommitted until submit; Reset restores from context |

**Derived, never stored:** the filtered+sorted forecast, the statistics, the
displayed (converted) temperatures and wind speeds, and "is this location a
favorite". These are recomputed from existing state on render (`useMemo` where
the computation is non‑trivial).

**LocalStorage** persists `favorites`, `searchHistory`, `temperatureUnit`,
`windUnit`, `theme` and the last selected location. All reads
go through [`utils/storage.js`](src/utils/storage.js), which wraps `JSON.parse`
in `try/catch` — corrupted data falls back to a default instead of crashing.

---

## Custom hooks

| Hook | Responsibility |
|---|---|
| `useLocalStorage(key, initial)` | `useState` mirrored to LocalStorage; lazy, guarded initial read; setter writes through |
| `useWeather(location)` | fetches the forecast for a location, keyed to its coordinates; aborts stale requests with `AbortController`; exposes `weather / isLoading / error / refetch` (loading & data are *derived* from a keyed result so all `setState` calls sit in async callbacks) |
| `useLocationSearch()` | runs a geocoding search; manages loading / error / results; a ref‑held `AbortController` cancels the previous request when a new search starts |
| `useGeolocation()` | promisified `navigator.geolocation`; returns a status machine (`idle / loading / granted / denied / unsupported`); never runs automatically |
| `useDebouncedValue(value, delay)` | debounces the search term so we don't hit the API on every keystroke |

---

## Performance notes

`useMemo` is used where a render‑time computation is real work and its inputs
change less often than the component re‑renders:
- `Statistics` — `calculateStatistics()` is a full reduce/map/filter pass; it
  depends only on the forecast array, not on theme/unit re‑renders.
- `Forecast` — the filter+sort produces a new sorted array each call.
- `HourlyWeather` / `TemperatureChart` — grouping / reshaping the hourly array.

`useCallback` is used for the context actions (`selectLocation`, `addFavorite`,
…) and `DashboardPage`'s `chooseLocation`, which are passed deep into
`SearchResults` / `FavoriteCard` / `SearchHistory`; stable identities keep the
context value and those children from re‑rendering needlessly.

---

## Known limitations

- Open‑Meteo returns "naive" local‑to‑location timestamps. They are displayed
  as‑is (parsed as UTC, formatted in UTC) so the wall‑clock digits are correct,
  but the "last updated" relative accuracy can be off by the browser/location
  timezone offset.
- Geolocation gives coordinates only — the detected place is labelled
  "My location" rather than a reverse‑geocoded city name (Open‑Meteo has no
  reverse geocoding).
- The production bundle is ~640 kB (mostly Recharts + React). Code‑splitting the
  chart / routes would help; left simple for readability.
- No automated tests in this submission (manual test pass only).
- Comparison selects initialise from the first two favorites and don't
  auto‑update if favorites change while the page is open.

---

## AI tools used

See [`AI_USAGE.md`](AI_USAGE.md) for the full disclosure. In short: an AI
assistant was used to scaffold the component structure, the utility functions
and the API transform layer; every file was reviewed, and the architecture,
state‑vs‑derived decisions and data‑flow design are understood and can be
explained and modified.

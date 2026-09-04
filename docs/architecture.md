# Architecture

## Request / data pipeline

```
        ┌───────┐
        │ User  │
        └───┬───┘
            │  types a city, toggles a unit, picks a filter
            ▼
┌───────────────────────────┐
│  React application         │   pages/  +  feature components/
│  (App → Layout → routes)   │
└───────────┬───────────────┘
            │  components call hooks
            ▼
┌───────────────────────────┐
│  Custom hooks              │   useWeather · useLocationSearch
│                            │   useLocalStorage · useGeolocation
│                            │   useDebouncedValue
└───────────┬───────────────┘
            │  hooks call the service layer
            ▼
┌───────────────────────────┐
│  Service layer             │   geocodingService · forecastService
│                            │   └─ openMeteoClient (fetch, URL building,
│                            │      AbortSignal, typed errors)
└───────────┬───────────────┘
            │  HTTP GET
            ▼
┌───────────────────────────┐
│  Open‑Meteo API            │   geocoding + forecast endpoints
└───────────┬───────────────┘
            │  JSON response (parallel arrays)
            ▼
┌───────────────────────────┐
│  Transformation            │   utils/transform.js
│                            │   parallel arrays → per‑day / per‑hour objects
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│  React state               │   hook state  +  Context
│                            │   (PreferencesProvider, LocationProvider)
└───────────┬───────────────┘
            │  props down
            ▼
┌───────────────────────────┐
│  UI                        │   derived values computed on render:
│                            │   filtered/sorted forecast, statistics,
│                            │   unit conversion, isFavorite
└───────────────────────────┘
```

## Component tree (abridged)

```
App
└─ PreferencesProvider
   └─ LocationProvider
      └─ Routes
         └─ Layout
            ├─ Header
            │  ├─ Navigation
            │  ├─ UnitToggle
            │  ├─ ThemeToggle
            │  └─ FavoritesIndicator
            └─ (route)
               ├─ DashboardPage
               │  ├─ SearchBar
               │  ├─ SearchResults → LocationCard
               │  ├─ DetectLocationButton
               │  ├─ SearchHistory
               │  ├─ CurrentWeather → WeatherIcon, FavoriteButton
               │  ├─ WeatherDetails → DetailTile
               │  ├─ Statistics → DetailTile
               │  ├─ Forecast → ForecastControls, ForecastCard → WeatherIcon
               │  ├─ TemperatureChart
               │  └─ HourlyWeather → HourlyDaySelector, HourlyWeatherRow
               ├─ FavoritesPage → Favorites → FavoriteCard
               ├─ ComparePage → ComparisonView → ComparisonColumn
               └─ SettingsPage → SettingsForm
```

## Communication patterns

- **Parent → child:** `DashboardPage` passes `weather.daily` to `<Forecast>`,
  `weather.current` to `<CurrentWeather>`, etc.
- **Child → parent (callback):** `<SearchBar onSearch>`, `<SearchResults onSelect>`,
  `<ForecastControls onFilterChange>`.
- **Siblings via shared state:** `<SearchResults>` and `<CurrentWeather>` never
  talk directly — selecting a result updates `selectedLocation` in
  `LocationProvider`, which `<CurrentWeather>` reads through `useWeather`.

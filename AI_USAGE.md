# AI Usage Disclosure

AI assistance was used to build this project. This document records how, in the
spirit of the assessment's AI policy: the goal is not to hide AI use but to show
that the submitted code is understood.

> **Note to reviewer:** update the specifics below (tools, exact prompts, which
> parts you changed yourself) to match your own process before submitting. The
> structure is here; the details must be yours.

---

## Tools used

| Tool | Used for |
|---|---|
| Claude (Anthropic) | Project scaffolding, component architecture, utility functions, the API transform layer, README/docs drafting |
| _(add ChatGPT / Copilot / Cursor / etc. if you used them)_ | _(what for)_ |

---

## Prompts used (representative)

- "Analyse this ReactJS assessment spec and produce a component architecture and
  state‑management plan (state vs derived, context vs local, custom hooks)."
- "Scaffold a service layer for the Open‑Meteo geocoding and forecast APIs with a
  fetch wrapper, typed errors and AbortController support."
- "Write the transform functions that turn Open‑Meteo's parallel arrays
  (time[], temperature_2m[], weather_code[] …) into a list of per‑hour and
  per‑day objects."
- "Implement a `useWeather` hook that refetches when the location changes and
  cancels the previous request."
- "Build the forecast filter/sort utilities using array methods without mutating
  the source array."
- "Set up Tailwind v4 class‑based dark mode with semantic colour tokens."

---

## What was AI‑generated / AI‑assisted

- Initial folder structure and the split into `components / hooks / services / utils / context / pages / constants`.
- Boilerplate for the common UI components (`Card`, `Button`, `Select`, `Loading`, `ErrorMessage`, `EmptyState`).
- First drafts of the utility modules (`temperature`, `wind`, `weatherCodes`, `statistics`, `datetime`, `forecast`, `validation`, `storage`, `transform`).
- First drafts of the custom hooks and the two context providers.
- The Recharts chart wiring and the responsive Tailwind classes.
- This README and `docs/architecture.md`.

## What was written / changed by hand

_(Fill this in with what you actually did — examples of the kind of thing to list:)_
- Adjusted the WMO weather‑code → group mapping and icon choices.
- Tuned the forecast filter thresholds and the "rainy day" definition.
- Reworked date/time handling after noticing Open‑Meteo returns naive timestamps.
- Simplified the hourly Today/Tomorrow logic to use the forecast index instead of timezone math.
- Fixed the temperature‑difference formatting in the comparison view (a delta scales by 1.8, it doesn't get the +32 offset).

## Bugs the AI introduced (and how they were caught)

_(Examples of the kind of thing to record — replace with what you actually hit:)_
- An early `useWeather` version called `setState` synchronously inside the effect
  body; ESLint (`react-hooks/set-state-in-effect`) flagged it and it was
  restructured to derive loading/data from a keyed result.
- A self‑referential `@theme inline` colour definition (`--color-x: var(--color-x)`)
  that produced no usable utilities — caught when styles didn't apply.
- Unused imports left behind after refactors — caught by `npm run lint`.

## How the generated code was verified

- `npm run lint` — zero errors/warnings.
- `npm run build` — succeeds.
- Manual walkthrough of every user flow in the browser (search, select, unit
  toggle, theme toggle, favorites add/remove/duplicate, history, filters, sort,
  hourly day switch, refresh persistence, `?city=` / `?lat=&lon=` URLs, invalid
  URL, corrupted LocalStorage, offline, geolocation allow/deny, comparison).
- Read every file end‑to‑end; can explain each function, each piece of state, and
  each `useEffect` dependency array.

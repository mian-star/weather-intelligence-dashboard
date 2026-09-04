/**
 * Shared colour-chip classes for metric icons across the dashboard (Current
 * Weather metrics, Statistics KPI tiles, a couple of section headings).
 *
 * One entry per concept so the same metric gets the same colour everywhere it
 * shows up. Each value pairs a soft tinted background with a matching icon
 * colour, with a `dark:` variant since these are deliberately vivid accents
 * that sit outside the light/dark surface token system in index.css.
 */
export const ICON_TONES = {
  temperatureHigh: 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400',
  temperatureLow: 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400',
  temperatureAverage: 'bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400',
  wind: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400',
  humidity: 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400',
  precipitation: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400',
  pressure: 'bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-400',
  rainyDays: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400',
  insights: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400',
  history: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
};

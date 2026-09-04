import { Moon, Sun } from 'lucide-react';
import { usePreferences } from '../../context/preferencesContext';
import { THEMES } from '../../constants/preferences';

/** Light / dark switch. The theme value is persisted and survives a refresh. */
export function ThemeToggle() {
  const { theme, toggleTheme } = usePreferences();
  const isDark = theme === THEMES.DARK;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-border bg-surface text-muted transition-colors hover:border-brand/60 hover:text-content"
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5" aria-hidden="true" />
      ) : (
        <Moon className="h-4.5 w-4.5" aria-hidden="true" />
      )}
    </button>
  );
}

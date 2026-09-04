import { CloudSun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FavoritesIndicator } from '../common/FavoritesIndicator';
import { ThemeToggle } from '../common/ThemeToggle';
import { UnitToggle } from '../common/UnitToggle';
import { MobileNav, Navigation } from './Navigation';

/**
 * App header: logo, primary navigation, temperature-unit selector, theme
 * selector and the favorites indicator. Below `md` the nav collapses into the
 * hamburger drawer (<MobileNav />); the unit / theme / favorites controls stay
 * visible at every width.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-subtle-border bg-surface/85 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/weather"
          className="flex items-center gap-2.5 text-[0.95rem] font-bold tracking-tight text-content"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-contrast shadow-soft">
            <CloudSun className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">
            Weather <span className="text-brand">Intelligence</span>
          </span>
        </Link>

        <Navigation />

        <div className="ml-auto flex items-center gap-2">
          <UnitToggle />
          <ThemeToggle />
          <FavoritesIndicator />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/weather', label: 'Dashboard' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/compare', label: 'Compare' },
  { to: '/settings', label: 'Settings' },
];

/**
 * Primary navigation (desktop). NavLink handles client-side routing (no full
 * reload) and exposes `isActive` for styling the current page. Hidden below the
 * `md` breakpoint, where <MobileNav /> takes over.
 */
export function Navigation() {
  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-1 rounded-xl bg-raised/70 p-1">
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-surface text-brand shadow-soft'
                    : 'text-muted hover:text-content'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Mobile navigation: a hamburger button that opens a panel of the same links
 * below the header. Only rendered below `md`. Closes on link tap, Escape, or a
 * click outside.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-border bg-surface text-muted transition-colors hover:border-brand/60 hover:text-content"
      >
        {open ? (
          <X className="h-4.5 w-4.5" aria-hidden="true" />
        ) : (
          <Menu className="h-4.5 w-4.5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <nav
          id="mobile-nav-panel"
          aria-label="Primary"
          className="absolute left-0 right-0 top-full border-b border-subtle-border bg-surface px-4 pb-3 pt-1 shadow-float"
        >
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-soft text-brand'
                        : 'text-muted hover:bg-raised hover:text-content'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

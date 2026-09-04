import { Outlet } from 'react-router-dom';
import { Header } from './Header';

/**
 * App shell shared by every route: the header plus a <main> that renders the
 * active page through <Outlet />. The page-level atmosphere (the faint sky
 * washes behind everything) is painted by `body::before` in index.css.
 */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}

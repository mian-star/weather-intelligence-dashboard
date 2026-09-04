import { MotionConfig } from 'motion/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LocationProvider } from './context/LocationProvider';
import { PreferencesProvider } from './context/PreferencesProvider';
import { ComparePage } from './pages/ComparePage';
import { DashboardPage } from './pages/DashboardPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';

/**
 * Providers wrap the router so every route can read preferences and the
 * selected location. Routing is client-side (react-router) — navigating between
 * pages never triggers a full browser reload.
 *
 * <MotionConfig reducedMotion="user"> makes every Motion animation in the app
 * respect the operating-system "reduce motion" accessibility setting.
 */
function App() {
  return (
    <PreferencesProvider>
      <LocationProvider>
        <MotionConfig reducedMotion="user">
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/weather" replace />} />
              <Route path="weather" element={<DashboardPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </MotionConfig>
      </LocationProvider>
    </PreferencesProvider>
  );
}

export default App;

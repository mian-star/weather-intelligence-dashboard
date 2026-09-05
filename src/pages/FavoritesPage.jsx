import { motion } from 'motion/react';
import { Favorites } from '../components/favorites/Favorites';
import { fadeUp } from '../utils/motion';

export function FavoritesPage() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl space-y-6"
    >
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-content sm:text-3xl">Favorites</h1>
        <p className="mt-1 text-sm text-muted">
          Your saved locations, ready to open in one tap.
        </p>
      </header>
      <Favorites />
    </motion.div>
  );
}

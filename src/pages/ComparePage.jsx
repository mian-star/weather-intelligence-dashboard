import { motion } from 'motion/react';
import { ComparisonView } from '../components/comparison/ComparisonView';
import { fadeUp } from '../utils/motion';

export function ComparePage() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl space-y-6"
    >
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-content sm:text-3xl">Compare</h1>
        <p className="mt-1 text-sm text-muted">
          Put two saved locations side by side.
        </p>
      </header>
      <ComparisonView />
    </motion.div>
  );
}

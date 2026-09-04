import { motion } from 'motion/react';
import { SettingsForm } from '../components/settings/SettingsForm';
import { fadeUp } from '../utils/motion';

export function SettingsPage() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl space-y-6"
    >
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-content sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Units, theme, and how the forecast is displayed.
        </p>
      </header>
      <SettingsForm />
    </motion.div>
  );
}

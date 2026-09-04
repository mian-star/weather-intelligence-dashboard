/**
 * Shared Motion (motion/react) animation presets.
 *
 * Every animation in the app pulls from this one file so the motion vocabulary
 * stays small and consistent: things fade up on entrance, lists stagger their
 * children, and interactive surfaces lift very slightly on hover/tap.
 *
 * Motion automatically honours the OS "reduce motion" setting when a
 * <MotionConfig reducedMotion="user"> wraps the tree (see App.jsx), so these
 * presets don't need their own guards.
 */

const EASE = [0.22, 1, 0.36, 1];

/** Fade + rise. Use for a section or panel appearing. */
export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/** Parent of a list: reveal children one after another. */
export const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

/** A single list item (forecast card, hour, tile). */
export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
};

/** Standard "animate in when it scrolls into view" props for a <motion.*>. */
export const revealOnView = {
  variants: fadeUp,
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.2 },
};

/** Subtle press feedback for buttons / selectable chips. */
export const tapScale = { whileTap: { scale: 0.97 } };

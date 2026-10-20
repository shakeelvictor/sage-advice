/** Spring presets. Everything in Lamplight moves on springs, never on fixed easings. */
export const spring = { type: 'spring', stiffness: 170, damping: 26, mass: 1 } as const;
export const springSoft = { type: 'spring', stiffness: 110, damping: 22, mass: 1 } as const;
export const springSnappy = { type: 'spring', stiffness: 420, damping: 32, mass: 0.8 } as const;

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const theme = {
  colors: {
    /** Legacy alias: the primary action color, now forest. */
    primary: 'var(--forest)',
    ground: 'var(--ground)',
    surface: 'var(--surface)',
    surface2: 'var(--surface-2)',
    forest: 'var(--forest)',
    onForest: 'var(--on-forest)',
    mint: 'var(--mint)',
    onMint: 'var(--on-mint)',
    ink: 'var(--ink)',
    ink2: 'var(--ink-2)',
    ink3: 'var(--ink-3)',
    sage: 'var(--sage)',
    ember: 'var(--ember)',
    emberInk: 'var(--ember-ink)',
    line: 'var(--line)',
    scrim: 'var(--scrim)',
    danger: 'var(--danger)',
    background: {
      primary: 'var(--ground)',
      secondary: 'var(--surface)',
    },
    text: {
      primary: 'var(--ink)',
      secondary: 'var(--ink-2)',
    },
  },
  shadows: {
    card: 'var(--shadow-card)',
    float: 'var(--shadow-float)',
  },
  fonts: {
    primary: 'var(--font-primary)',
    secondary: 'var(--font-display)',
    display: 'var(--font-display)',
  },
  radii: {
    s: 'var(--radius-s)',
    m: 'var(--radius-m)',
    l: 'var(--radius-l)',
    xl: 'var(--radius-xl)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  transitions: {
    default: '0.3s var(--ease-out)',
    smooth: '0.6s var(--ease-out)',
  },
};

export type AppTheme = typeof theme;

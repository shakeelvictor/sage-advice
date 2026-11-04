export const theme = {
  colors: {
    /** Legacy alias for the primary action color. */
    primary: 'var(--action)',
    ground: 'var(--ground)',
    surface: 'var(--surface)',
    surface2: 'var(--surface-2)',
    forest: 'var(--forest)',
    onForest: 'var(--on-forest)',
    action: 'var(--action)',
    onAction: 'var(--on-action)',
    mint: 'var(--mint)',
    onMint: 'var(--on-mint)',
    ink: 'var(--ink)',
    ink2: 'var(--ink-2)',
    ink3: 'var(--ink-3)',
    sage: 'var(--sage)',
    ember: 'var(--ember)',
    emberInk: 'var(--ember-ink)',
    emberOnForest: 'var(--ember-on-forest)',
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
  gradients: {
    forest: 'var(--grad-forest)',
    mint: 'var(--grad-mint)',
    action: 'var(--grad-action)',
    ember: 'var(--grad-ember)',
    surface: 'var(--grad-surface)',
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

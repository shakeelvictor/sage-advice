export const theme = {
  colors: {
    primary: 'var(--amber)',
    ground: 'var(--ground)',
    surface: 'var(--surface)',
    surface2: 'var(--surface-2)',
    ink: 'var(--ink)',
    ink2: 'var(--ink-2)',
    ink3: 'var(--ink-3)',
    sage: 'var(--sage)',
    moss: 'var(--moss)',
    amber: 'var(--amber)',
    ember: 'var(--ember)',
    onAmber: 'var(--on-amber)',
    line: 'var(--line)',
    glow: 'var(--glow)',
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
  fonts: {
    primary: 'var(--font-primary)',
    secondary: 'var(--font-display)',
    display: 'var(--font-display)',
  },
  radii: {
    s: 'var(--radius-s)',
    m: 'var(--radius-m)',
    l: 'var(--radius-l)',
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

import { createGlobalStyle } from 'styled-components';

/**
 * Clearing design tokens.
 * A clearing in a forest, mid-morning: cream-tinted ground, white cards, one deep-forest surface
 * per screen for the thing that matters, and a single ember accent that is always somewhere small.
 * Light is the primary theme; dark is a designed forest at dusk, not an inversion.
 *
 * Contrast (WCAG): every text token clears 4.5:1 on ground, surface and surface-2 in both themes.
 * Three values differ from the brief because the brief's values did not clear it:
 * light --ink-3 (#6B7F70 was 4.0:1 on ground), light --ember-ink (#9A6A2C was 4.4:1),
 * dark --ink-3 (#7E9486 was 3.8:1 on surface-2). --on-mint exists because dark --ink on --mint is 1.7:1.
 */
export const GlobalStyles = createGlobalStyle`
  :root {
    --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
    --font-primary: 'Onest', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-secondary: var(--font-display);

    --radius-s: 12px;
    --radius-m: 18px;
    --radius-l: 24px;
    --radius-xl: 28px;

    --nav-h: 64px;
    --rail-w: 92px;
    --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  :root, .light {
    --ground: #F6F8EF;
    --surface: #FFFFFF;
    --surface-2: #EEF4E6;
    --forest: #1E3A34;
    --on-forest: #F6F8EF;
    --mint: #CDE9D3;
    --on-mint: #1E3A34;
    /* The primary action. Forest in light; mint in dark, where forest sits below the ground and would vanish. */
    --action: var(--forest);
    --on-action: var(--on-forest);
    --ink: #1E3A34;
    --ink-2: #4F6B5A;
    --ink-3: #5F7366;
    --sage: #4F6B5A;
    --ember: #D9A05B;
    --ember-ink: #8F6226;
    --line: rgba(30, 58, 52, 0.10);
    --shadow-card: 0 10px 26px rgba(30, 58, 52, 0.08);
    --shadow-float: 0 12px 30px rgba(30, 58, 52, 0.14);
    --focus: var(--sage);
    --scrim: rgba(15, 31, 27, 0.62);
    --danger: #A8472F;
    color-scheme: light;
  }

  .dark {
    --ground: #0F1F1B;
    --surface: #17302A;
    --surface-2: #1E3A34;
    --forest: #0A1714;
    --on-forest: #F6F8EF;
    --mint: #8FC9A6;
    --on-mint: #0A1714;
    --action: var(--mint);
    --on-action: var(--on-mint);
    --ink: #EDF3EA;
    --ink-2: #A9BFAE;
    --ink-3: #90A697;
    --sage: #8FA98F;
    --ember: #E9B872;
    --ember-ink: #E9B872;
    --line: rgba(237, 243, 234, 0.12);
    --shadow-card: 0 10px 26px rgba(0, 0, 0, 0.35);
    --shadow-float: 0 12px 30px rgba(0, 0, 0, 0.45);
    --focus: var(--mint);
    --scrim: rgba(4, 10, 8, 0.78);
    --danger: #E08A72;
    color-scheme: dark;
  }

  /* Aliases kept for older components. */
  :root {
    --bg-primary: var(--ground);
    --bg-secondary: var(--surface);
    --text-primary: var(--ink);
    --text-secondary: var(--ink-2);
    --accent: var(--action);
  }

  /* Animatable progress for the Still halo (0 to 1). Browsers without @property step instead of easing. */
  @property --halo {
    syntax: '<number>';
    inherits: false;
    initial-value: 0;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    background: var(--ground);
    transition: background-color 0.4s ease;
  }

  body {
    font-family: var(--font-primary);
    font-weight: 400;
    color: var(--ink);
    background: var(--ground);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: color 0.4s ease, background-color 0.4s ease;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Titles are Onest. Fraunces is reserved for the wisdom line alone. */
  h1, h2, h3, h4 {
    font-family: var(--font-primary);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.12;
    text-wrap: balance;
    color: var(--ink);
  }

  p {
    letter-spacing: 0.005em;
  }

  strong { font-weight: 700; }

  button, input, textarea, select {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  a {
    color: var(--sage);
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 3px;
    border-radius: 6px;
  }

  ::selection {
    background: var(--mint);
    color: var(--on-mint);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyles;

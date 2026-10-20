import { createGlobalStyle } from 'styled-components';

/**
 * Lamplight design tokens.
 * A quiet study at dusk: sage green for structure, candle amber for the one thing you can press.
 * Dark is the primary theme; light is designed, not inverted.
 */
export const GlobalStyles = createGlobalStyle`
  :root {
    --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
    --font-primary: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-secondary: var(--font-display);

    --radius-s: 10px;
    --radius-m: 16px;
    --radius-l: 24px;

    --nav-h: 64px;
    --rail-w: 84px;
    --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  :root, .light {
    --ground: #EEF1EA;
    --surface: #FFFFFF;
    --surface-2: #E4EAE2;
    --ink: #1C2622;
    --ink-2: #5B6B61;
    --ink-3: #8B9890;
    --sage: #4F6B5A;
    --moss: #8FA98F;
    --amber: #B8853F;
    --ember: #D4A373;
    --on-amber: #FFFFFF;
    --line: rgba(28, 38, 34, 0.12);
    --glow: rgba(212, 163, 115, 0.32);
    --scrim: rgba(20, 30, 26, 0.72);
    --danger: #B5553F;
    color-scheme: light;
  }

  .dark {
    --ground: #0F1A17;
    --surface: #16241F;
    --surface-2: #1D2F28;
    --ink: #EDE7DA;
    --ink-2: #A8B3A6;
    --ink-3: #6F7E74;
    --sage: #8FA98F;
    --moss: #4F6B5A;
    --amber: #D4A373;
    --ember: #E9B872;
    --on-amber: #0F1A17;
    --line: rgba(237, 231, 218, 0.12);
    --glow: rgba(233, 184, 114, 0.30);
    --scrim: rgba(6, 12, 10, 0.78);
    --danger: #D9775F;
    color-scheme: dark;
  }

  /* Aliases kept for older components. */
  :root {
    --bg-primary: var(--ground);
    --bg-secondary: var(--surface);
    --text-primary: var(--ink);
    --text-secondary: var(--ink-2);
    --accent: var(--amber);
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
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: color 0.4s ease;
  }

  /* The lamp: one warm glow at the top of every screen, breathing slowly. */
  body::before {
    content: '';
    position: fixed;
    left: 50%;
    top: -22vh;
    width: 120vw;
    height: 70vh;
    transform: translateX(-50%);
    background: radial-gradient(50% 60% at 50% 30%, var(--glow), transparent 72%);
    pointer-events: none;
    z-index: -1;
    animation: lamp 9s ease-in-out infinite;
  }

  @keyframes lamp {
    0%, 100% { opacity: 0.75; transform: translateX(-50%) scale(1); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.06); }
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 400;
    font-variation-settings: 'SOFT' 50;
    font-optical-sizing: auto;
    letter-spacing: -0.01em;
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
    color: var(--amber);
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid var(--ember);
    outline-offset: 3px;
    border-radius: 6px;
  }

  ::selection {
    background: color-mix(in srgb, var(--amber) 35%, transparent);
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

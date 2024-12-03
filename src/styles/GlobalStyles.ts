import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --font-primary: 'Manrope', sans-serif;
    --font-secondary: 'Syne', sans-serif;
  }

  :root, .light {
    --bg-primary: linear-gradient(-45deg, #e5e7eb, #c1dfef, #e0f8ff, #f3f3f3);
    --bg-secondary: #fcfcff;
    --text-primary: #1a1a1a;
    --text-secondary: #4a4a4a;
    --accent: #73a5d4;
  }

  .dark {
    --bg-primary: linear-gradient(-45deg, #17153B, #110d2a, #191454, #2e0742);
    --bg-secondary: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #e0e0e0;
    --accent: #7374d4 ;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-primary);
    font-weight: 300;
    background: var(--bg-primary);
    background-size: 400% 400%;
	  animation: gradient 15s ease infinite;
    height: 100vh;
    color: var(--text-primary);
    line-height: 1.6;
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-primary);
    font-weight: 400;
    letter-spacing: -0.03em;
    line-height: 1.2;
  }

  h1 {
    font-weight: 800;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  p {
    font-weight: 300;
    letter-spacing: 0.01em;
  }

  button {
    font-family: var(--font-primary);
    font-weight: 300;
  }

  input, textarea {
    font-family: var(--font-primary);
    font-weight: 300;
  }

  strong {
    font-weight: 600;
  }

  @keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
`;

export default GlobalStyles;
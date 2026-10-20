import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Layout from './components/Layout';
import AppRoutes from './routes';

/** First visit opens on About so the purpose lands before the first line of wisdom. */
const FirstVisit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited && location.pathname === '/') {
      localStorage.setItem('hasVisitedBefore', 'true');
      navigate('/about');
    }
  }, [navigate, location]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <StyledThemeProvider theme={theme}>
        <MotionConfig reducedMotion="user">
          <Router>
            <FirstVisit />
            <GlobalStyles />
            <Layout>
              <AppRoutes />
            </Layout>
          </Router>
        </MotionConfig>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}

export default App;

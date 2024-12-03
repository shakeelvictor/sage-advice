import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Layout from './components/Layout';
import AppRoutes from './routes';
import Loader from './components/Loader';

// Wrapper component to handle navigation
const NavigationHandler = () => {
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <StyledThemeProvider theme={theme}>
        <SidebarProvider>
          <Router>
            <NavigationHandler />
            <GlobalStyles />
            <AnimatePresence mode="wait">
              {isLoading ? (
                <Loader key="loader" />
              ) : (
                <Layout key="content">
                  <AppRoutes />
                </Layout>
              )}
            </AnimatePresence>
          </Router>
        </SidebarProvider>
      </StyledThemeProvider>
    </ThemeProvider>
  );
}

export default App;
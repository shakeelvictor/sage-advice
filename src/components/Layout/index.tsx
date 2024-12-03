import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease;
  position: relative;
  overflow-x: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 60px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
    padding-top: 5rem;
  }
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <AnimatePresence mode="wait">
          {React.cloneElement(children as React.ReactElement, {
            key: location.pathname
          })}
        </AnimatePresence>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
import React from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Nav from '../Nav';

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
  width: 100%;
  padding-inline: max(1rem, env(safe-area-inset-left, 0px)) max(1rem, env(safe-area-inset-right, 0px));
  padding-block: calc(1.25rem + env(safe-area-inset-top, 0px)) calc(var(--nav-h) + env(safe-area-inset-bottom, 0px) + 1.5rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: var(--rail-w);
    padding-inline: clamp(1.5rem, 5vw, 4rem);
    padding-block: 2.5rem 3rem;
  }
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <Shell>
      <Nav />
      <Main>
        <AnimatePresence mode="wait">
          {React.cloneElement(children as React.ReactElement, { key: location.pathname })}
        </AnimatePresence>
      </Main>
    </Shell>
  );
};

export default Layout;

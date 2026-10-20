import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { fadeUp, spring } from '../../styles/motion';

const Page = styled(motion.div)`
  position: relative;
  width: 100%;
`;

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Page variants={fadeUp} initial="initial" animate="animate" exit="exit" transition={spring}>
      {children}
    </Page>
  );
};

export default PageTransition;

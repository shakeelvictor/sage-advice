import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LogoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

const LogoImage = styled(motion.img)`
  width: 48px;
  height: 48px;
  object-fit: contain;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
  }
`;

const LogoText = styled.div`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.125rem;
  }
`;

interface SidebarLogoProps {
  showText?: boolean;
  className?: string;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ showText = true, className }) => {
  return (
    <LogoContainer
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <LogoImage
        src="/sa-logo.png"
        alt="Sage Advice"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {showText && (
        <LogoText
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Sage Advice
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default SidebarLogo;
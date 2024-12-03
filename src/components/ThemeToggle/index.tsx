import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BsSun, BsMoon, BsDisplay } from 'react-icons/bs';
import { useTheme } from '../../context/ThemeContext';

const Container = styled.div`
  margin-top: auto;
  padding: 1rem 0;
`;

const ThemeButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  border: none;
  border-radius: 0.5rem;
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  margin-bottom: 0.5rem;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.background.primary};
  }
`;

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Container>
      <ThemeButton
        $active={theme === 'light'}
        onClick={() => setTheme('light')}
        whileTap={{ scale: 0.95 }}
      >
        <BsSun size={16} /> Light
      </ThemeButton>
      <ThemeButton
        $active={theme === 'dark'}
        onClick={() => setTheme('dark')}
        whileTap={{ scale: 0.95 }}
      >
        <BsMoon size={16} /> Dark
      </ThemeButton>
      <ThemeButton
        $active={theme === 'system'}
        onClick={() => setTheme('system')}
        whileTap={{ scale: 0.95 }}
      >
        <BsDisplay size={16} /> System
      </ThemeButton>
    </Container>
  );
};

export default ThemeToggle;
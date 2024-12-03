import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SkipForward } from 'lucide-react';

const Button = styled(motion.button)`
  position: fixed;
  top: 2.8rem;
  right: 2rem;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 36px;
    height: 36px;
    right: -18px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

interface SkipButtonProps {
  onSkip: () => void;
}

const SkipButton: React.FC<SkipButtonProps> = ({ onSkip }) => {
  return (
    <Button
      onClick={onSkip}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <SkipForward />
    </Button>
  );
};

export default SkipButton;
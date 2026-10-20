import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];
const PETAL = 'M50,50 Q70,30 50,10 Q30,30 50,50 Z';

/** The static eight-petal mark, used in navigation and empty states. */
export const Mark: React.FC<{ size?: number; className?: string }> = ({ size = 32, className }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
    {PETALS.map((r) => (
      <path key={r} d={PETAL} fill="none" stroke="currentColor" strokeWidth="2.2" transform={`rotate(${r} 50 50)`} />
    ))}
    <circle cx="50" cy="50" r="3" fill="currentColor" />
  </svg>
);

const Container = styled(motion.div)<{ $size: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ $size }) => ($size === 'small' ? '0.75rem' : $size === 'medium' ? '1rem' : '1.5rem')};
  color: ${({ theme }) => theme.colors.amber};
`;

const Svg = styled(motion.svg)<{ $size: 'small' | 'medium' | 'large' }>`
  width: ${({ $size }) => ($size === 'small' ? '44px' : $size === 'medium' ? '64px' : '140px')};
  height: auto;
  filter: drop-shadow(0 0 18px var(--glow));
`;

const Text = styled(motion.div)<{ $size: 'small' | 'medium' | 'large' }>`
  font-family: ${({ theme }) => theme.fonts.display};
  font-variation-settings: 'SOFT' 60;
  font-size: ${({ $size }) => ($size === 'small' ? '1.25rem' : $size === 'medium' ? '1.75rem' : '3rem')};
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.ink};
  text-align: center;
`;

const petal = {
  hidden: { pathLength: 0, opacity: 0.2 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2.4, ease: 'easeInOut', delay: i * 0.15, repeat: Infinity, repeatType: 'reverse' as const },
  }),
};

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'large', showText = true, className }) => (
  <Container $size={size} className={className} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
    <Svg
      $size={size}
      viewBox="0 0 100 100"
      animate={{ rotate: 360 }}
      transition={{ duration: 90, ease: 'linear', repeat: Infinity }}
    >
      {PETALS.map((r, i) => (
        <motion.path
          key={r}
          d={PETAL}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          transform={`rotate(${r} 50 50)`}
          custom={i}
          variants={petal}
          initial="hidden"
          animate="visible"
        />
      ))}
    </Svg>
    {showText && (
      <Text $size={size} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        Sage Advice
      </Text>
    )}
  </Container>
);

export default Logo;

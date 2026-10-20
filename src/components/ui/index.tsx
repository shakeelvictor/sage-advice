import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

/** Small shared primitives. Amber is reserved for the one action that matters on a screen. */

export const Eyebrow = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
`;

export const PageHeader = styled.header`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 2rem;
  max-width: 62ch;
`;

export const PageTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-variation-settings: 'SOFT' 60;
`;

export const PageIntro = styled.p`
  color: ${({ theme }) => theme.colors.ink2};
  font-size: 1.02rem;
  max-width: 56ch;
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0 1.25rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s var(--ease-out), box-shadow 0.25s ease;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const Button = styled(motion.button)`
  ${buttonBase}
  background: ${({ theme }) => theme.colors.amber};
  color: ${({ theme }) => theme.colors.onAmber};
  box-shadow: 0 10px 30px -14px var(--glow);

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.ember};
  }
`;

export const GhostButton = styled(motion.button)`
  ${buttonBase}
  background: transparent;
  color: ${({ theme }) => theme.colors.ink2};
  border: 1px solid ${({ theme }) => theme.colors.line};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.ink};
    border-color: ${({ theme }) => theme.colors.moss};
  }
`;

export const TextButton = styled(motion.button)`
  ${buttonBase}
  min-height: 36px;
  padding: 0 0.5rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink2};
  font-weight: 600;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.amber};
  }
`;

export const IconButton = styled(motion.button)<{ $tone?: 'amber' | 'ghost' | 'danger'; $size?: number }>`
  width: ${({ $size = 48 }) => `${$size}px`};
  height: ${({ $size = 48 }) => `${$size}px`};
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 1.8;
  }

  ${({ $tone = 'ghost', theme }) =>
    $tone === 'amber'
      ? css`
          background: ${theme.colors.amber};
          color: ${theme.colors.onAmber};
          box-shadow: 0 10px 30px -14px var(--glow);
          &:hover { background: ${theme.colors.ember}; }
        `
      : $tone === 'danger'
        ? css`
            background: transparent;
            color: ${theme.colors.ink3};
            border-color: ${theme.colors.line};
            &:hover { color: ${theme.colors.danger}; border-color: ${theme.colors.danger}; }
          `
        : css`
            background: transparent;
            color: ${theme.colors.ink2};
            border-color: ${theme.colors.line};
            &:hover { color: ${theme.colors.ink}; border-color: ${theme.colors.moss}; }
          `}
`;

export const Chip = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 36px;
  padding: 0 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: capitalize;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.amber : theme.colors.line)};
  background: ${({ $active, theme }) => ($active ? `color-mix(in srgb, ${theme.colors.amber} 16%, transparent)` : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.amber : theme.colors.ink2)};
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.8;
  }

  &:hover {
    color: ${({ $active, theme }) => ($active ? theme.colors.amber : theme.colors.ink)};
    border-color: ${({ $active, theme }) => ($active ? theme.colors.amber : theme.colors.moss)};
  }
`;

export const Tag = styled.span`
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
  border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.sage} 45%, transparent);
`;

export const Surface = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: var(--radius-l);
`;

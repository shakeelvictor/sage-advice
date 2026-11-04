import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Small shared primitives for Clearing.
 * Forest is the primary action. Ember is never a button fill for an action; it marks love and progress.
 * Cards are white on the warm ground and carry a soft shadow instead of a border.
 */

export const Eyebrow = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ink3};
`;

export const PageHeader = styled.header`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 2rem;
  max-width: 62ch;
`;

export const PageTitle = styled.h1`
  font-size: clamp(2rem, 6vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.03em;
`;

/**
 * The Clearing headline: a bold phrase and a light phrase in one line.
 * Use once per screen, at the top: <Headline>Good evening, <span>what do you need?</span></Headline>
 */
export const Headline = styled.h1`
  font-size: clamp(1.85rem, 7.4vw, 2.5rem);
  font-weight: 650;
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.ink};

  span {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.ink3};
  }
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
  min-height: 48px;
  padding: 0 1.4rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: -0.005em;
  white-space: nowrap;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s var(--ease-out), box-shadow 0.25s ease;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

/** The primary action: a forest pill (mint in dark). */
export const Button = styled(motion.button)`
  ${buttonBase}
  background: ${({ theme }) => theme.colors.action};
  background-image: ${({ theme }) => theme.gradients.action};
  color: ${({ theme }) => theme.colors.onAction};
  box-shadow: ${({ theme }) => theme.shadows.float};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

/** A mint pill, for the primary action that sits on a forest surface. */
export const MintButton = styled(motion.button)`
  ${buttonBase}
  background: ${({ theme }) => theme.colors.mint};
  background-image: ${({ theme }) => theme.gradients.mint};
  color: ${({ theme }) => theme.colors.onMint};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

export const GhostButton = styled(motion.button)`
  ${buttonBase}
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink};
  box-shadow: ${({ theme }) => theme.shadows.card};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
`;

export const TextButton = styled(motion.button)`
  ${buttonBase}
  min-height: 40px;
  padding: 0 0.6rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink2};
  font-weight: 600;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

export type IconTone = 'forest' | 'ember' | 'surface' | 'ghost' | 'danger' | 'onForest';

export const IconButton = styled(motion.button)<{ $tone?: IconTone; $size?: number }>`
  flex: none;
  width: ${({ $size = 48 }) => `${$size}px`};
  height: ${({ $size = 48 }) => `${$size}px`};
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 1.9;
  }

  ${({ $tone = 'ghost', theme }) => {
    switch ($tone) {
      case 'forest':
        return css`
          background: ${theme.colors.action};
          background-image: ${theme.gradients.action};
          color: ${theme.colors.onAction};
          box-shadow: ${theme.shadows.float};
        `;
      case 'ember':
        // A loved heart: forest icon on an ember disc (5.3:1), legible on white and on forest alike.
        return css`
          background: ${theme.colors.ember};
          background-image: ${theme.gradients.ember};
          color: var(--forest);
        `;
      case 'surface':
        return css`
          background: ${theme.colors.surface};
          background-image: ${theme.gradients.surface};
          color: ${theme.colors.ink};
          box-shadow: ${theme.shadows.card};
        `;
      case 'onForest':
        return css`
          background: color-mix(in srgb, ${theme.colors.onForest} 10%, transparent);
          color: ${theme.colors.onForest};
          &:hover { background: color-mix(in srgb, ${theme.colors.onForest} 18%, transparent); }
        `;
      case 'danger':
        return css`
          background: transparent;
          color: ${theme.colors.ink3};
          &:hover { color: ${theme.colors.danger}; background: ${theme.colors.surface2}; }
        `;
      default:
        return css`
          background: transparent;
          color: ${theme.colors.ink2};
          &:hover { color: ${theme.colors.ink}; background: ${theme.colors.surface2}; }
        `;
    }
  }}
`;

/**
 * Selected chips fill mint. Mint against white is only 1.2:1, so selection is also carried by
 * weight and ink color, and by aria-pressed for assistive tech.
 */
export const Chip = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 40px;
  padding: 0 1rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: ${({ $active }) => ($active ? 650 : 500)};
  letter-spacing: -0.005em;
  background: ${({ $active, theme }) => ($active ? theme.colors.mint : theme.colors.surface2)};
  background-image: ${({ $active, theme }) => ($active ? theme.gradients.mint : 'none')};
  color: ${({ $active, theme }) => ($active ? theme.colors.onMint : theme.colors.ink2)};
  transition: background-color 0.25s ease, color 0.25s ease;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.9;
  }

  &:hover {
    color: ${({ $active, theme }) => ($active ? theme.colors.onMint : theme.colors.ink)};
  }
`;

export const Tag = styled.span`
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ink2};
  background: ${({ theme }) => theme.colors.surface2};
`;

/** A white card on the warm ground. Shadow and radius do the work; no border. */
export const Surface = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  background-image: ${({ theme }) => theme.gradients.surface};
  border-radius: var(--radius-l);
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

/** The one deep-forest surface per screen. Focus rings switch to mint inside it. */
export const ForestCard = styled(motion.section)`
  --focus: var(--mint);
  position: relative;
  background: ${({ theme }) => theme.colors.forest};
  background-image: ${({ theme }) => theme.gradients.forest};
  color: ${({ theme }) => theme.colors.onForest};
  border-radius: var(--radius-xl);
  box-shadow: ${({ theme }) => theme.shadows.float};
  padding: clamp(1.4rem, 5vw, 2rem);
`;

/** Text visible only to screen readers. */
export const VisuallyHidden = styled.span`
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

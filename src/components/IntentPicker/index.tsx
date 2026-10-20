import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { Eyebrow, TextButton } from '../ui';
import { INTENTS, Intent } from '../../utils/ritual';
import { spring } from '../../styles/motion';

const Wrap = styled(motion.div)`
  display: grid;
  gap: 1.5rem;
`;

const Question = styled.h1`
  font-size: clamp(2rem, 5.5vw, 3rem);
  font-weight: 300;
  font-variation-settings: 'SOFT' 80;
`;

const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;

const Option = styled(motion.button)<{ $active?: boolean }>`
  display: grid;
  gap: 0.25rem;
  text-align: left;
  padding: 1.1rem 1.2rem;
  min-height: 104px;
  border-radius: var(--radius-l);
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.amber : theme.colors.line)};
  background: ${({ $active, theme }) =>
    $active ? `color-mix(in srgb, ${theme.colors.amber} 14%, ${theme.colors.surface})` : theme.colors.surface};
  transition: border-color 0.25s ease, background-color 0.25s ease, transform 0.25s var(--ease-out);

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    font-size: 1.45rem;
    line-height: 1.1;
    color: ${({ theme }) => theme.colors.ink};
  }

  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.ink2};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.moss};
    transform: translateY(-2px);
  }
`;

const Foot = styled.div`
  display: flex;
  justify-content: flex-start;
`;

interface IntentPickerProps {
  current?: Intent | null;
  onPick: (intent: Intent | null) => void;
}

const list = { show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: spring } };

const IntentPicker = ({ current, onPick }: IntentPickerProps) => (
  <Wrap initial="hidden" animate="show" exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }} variants={list}>
    <motion.div variants={item} style={{ display: 'grid', gap: '0.6rem' }}>
      <Eyebrow>Before the line</Eyebrow>
      <Question>What do you need today?</Question>
    </motion.div>
    <Options role="group" aria-label="What do you need today?">
      {INTENTS.map(({ id, label, blurb }) => (
        <Option key={id} variants={item} $active={current === id} onClick={() => onPick(id)} whileTap={{ scale: 0.97 }} aria-pressed={current === id}>
          <strong>{label}</strong>
          <span>{blurb}</span>
        </Option>
      ))}
    </Options>
    <Foot as={motion.div} variants={item}>
      <TextButton onClick={() => onPick(null)}>
        <Shuffle /> Surprise me
      </TextButton>
    </Foot>
  </Wrap>
);

export default IntentPicker;

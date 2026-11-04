import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui';
import { spring } from '../../../styles/motion';

const Container = styled(motion.div)`
  display: grid;
  justify-items: center;
  gap: 1rem;
  text-align: center;
  padding: 2.5rem 1rem 1.5rem;

  h2 {
    font-size: 1.4rem;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 36ch;
  }
`;

/* One soft mint blob: a bed waiting for its first seed. No illustration. */
const Blob = styled.div`
  width: 132px;
  aspect-ratio: 1;
  margin-bottom: 0.5rem;
  background: radial-gradient(circle at 40% 38%, color-mix(in srgb, var(--mint) 70%, var(--surface)), var(--mint) 70%);
  border-radius: 46% 54% 52% 48% / 55% 45% 55% 45%;
  animation: bed-drift 14s ease-in-out infinite;

  @keyframes bed-drift {
    0%, 100% { border-radius: 46% 54% 52% 48% / 55% 45% 55% 45%; }
    50% { border-radius: 54% 46% 47% 53% / 47% 54% 46% 53%; }
  }
`;

const EmptyState = () => (
  <Container initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
    <Blob aria-hidden />
    <h2>Nothing planted yet</h2>
    <p>When a line stays with you, keep it. It takes root here and grows as you write about it and come back to it.</p>
    <Button as={Link} to="/">
      Find a line
    </Button>
  </Container>
);

export default EmptyState;

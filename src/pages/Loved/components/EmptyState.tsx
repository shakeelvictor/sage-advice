import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mark } from '../../../components/Logo';
import { Surface, Button } from '../../../components/ui';
import { spring } from '../../../styles/motion';

const Container = styled(motion(Surface))`
  display: grid;
  justify-items: center;
  gap: 0.9rem;
  text-align: center;
  padding: 3.5rem 1.5rem;
  color: ${({ theme }) => theme.colors.amber};

  h2 {
    font-size: 1.6rem;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 36ch;
  }
`;

const EmptyState = () => (
  <Container initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
    <Mark size={44} />
    <h2>Nothing kept yet</h2>
    <p>When a line stays with you, love it. It will wait for you here, with room for a note.</p>
    <Button as={Link} to="/">Find a line</Button>
  </Container>
);

export default EmptyState;

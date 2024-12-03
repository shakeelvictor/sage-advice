import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const Container = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 1rem;
  gap: 1rem;
`;

const LoadingIcon = styled(motion.div)`
  color: ${({ theme }) => theme.colors.primary};

  svg {
    width: 32px;
    height: 32px;
  }
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const spinAnimation = {
  rotate: [0, 360],
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear"
  }
};

const LoadingState = () => {
  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingIcon animate={spinAnimation}>
        <Loader />
      </LoadingIcon>
      <LoadingText>Loading wisdom...</LoadingText>
    </Container>
  );
};

export default LoadingState;
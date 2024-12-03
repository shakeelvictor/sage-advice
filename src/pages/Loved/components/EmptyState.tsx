import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  text-align: center;
  padding: 4rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 1rem;
  margin-top: 2rem;
`;

const Icon = styled.div`
  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
    justify-self: center;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.125rem;
`;

const EmptyState = () => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Icon>
        <FaHeart />
      </Icon>
      <Title>No saved wisdom yet</Title>
      <Description>Your loved videos and notes will appear here</Description>
    </Container>
  );
};

export default EmptyState;
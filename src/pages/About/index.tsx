import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageTransition from '../../components/PageTransition';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Paragraph = styled(motion.p)`
  font-size: 1.125rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 300;
  letter-spacing: 0.01em;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const FloatingButtonWrapper = styled(motion.div)`
  position: relative;
  margin-top: 2rem;
  left: 40%;
  transform: translateX(-50%);
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    left: 46%;
  }
`;

const FloatingButton = styled(motion.button)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1),
              0 4px 8px -4px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-2px);
    box-shadow: 0 12px 20px -4px rgba(0, 0, 0, 0.2),
                0 8px 12px -4px rgba(0, 0, 0, 0.12);
  }
`;

const bounceAnimation = {
  initial: { opacity: 0, scale: 0, y: 100 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 1.5
    }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const About = () => {
  const navigate = useNavigate();
  const [showHomeButton, setShowHomeButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHomeButton(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransition>
      <Container>
        <Title>About</Title>
        <Content>
          <Paragraph
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            We live in a world overwhelmed by crises—ecological, political, economic, and social. As trust in our institutions continues to erode and the promises of modernity and the deconstructions of postmodernity leave many feeling adrift, it can be hard to find a place to turn for wisdom and hope. <strong>Sage Advice</strong> is designed to be that place—a small sanctuary where you can find inspiration, motivation, and a reminder that life is truly worth living.
          </Paragraph>
          <Paragraph
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            In an age where technology often fuels division and negativity, this app aims to harmonize ethics, technology, and the pursuit of virtuous living. The clips you'll find here have been carefully chosen, not to rehash watered-down platitudes, but to spark genuine reflection. Begin your journey toward a clearer mind, a stronger sense of purpose, and a better life.
          </Paragraph>
        </Content>

        {showHomeButton && (
          <FloatingButtonWrapper
            variants={bounceAnimation}
            initial="initial"
            animate="animate"
          >
            <FloatingButton
              onClick={() => navigate('/')}
              variants={floatAnimation}
              animate="animate"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Home />
            </FloatingButton>
          </FloatingButtonWrapper>
        )}
      </Container>
    </PageTransition>
  );
};

export default About;
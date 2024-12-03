import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BsPlayFill } from 'react-icons/bs';
import VideoPlayer from '../../components/VideoPlayer';
import Logo from '../../components/Logo';
import PageTransition from '../../components/PageTransition';
import { useSidebar } from '../../context/SidebarContext';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 4rem);
  text-align: center;
  padding: 2rem;
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  margin: 2rem 0 3rem;
  color: ${({ theme }) => theme.fonts.primary};
  font-weight: 300;
  letter-spacing: 0.02em;
`;

const PlayButtonWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 60px;
    height: 60px;
  }
`;

const PlayButton = styled(motion.button)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 50%;
  z-index: 1;

  svg {
    width: 32px;
    height: 32px;
    margin-left: 4px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const RippleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Ripple = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}40;
`;

const bounceAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-8, 0],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const Home = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { setIsCollapsed } = useSidebar();
  const [isRippling, setIsRippling] = useState(false);

  const handlePlayClick = () => {
    setIsRippling(true);
    setIsCollapsed(true);
    setTimeout(() => {
      setIsVideoOpen(true);
    }, 300);
  };

  return (
    <PageTransition>
      <HomeContainer>
        <Logo size="large" />
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Begin your path
        </Subtitle>
        <PlayButtonWrapper>
          <PlayButton
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={["visible", "animate"]}
            variants={{
              visible: {
                opacity: 1,
                scale: 1,
                transition: { delay: 0.6, duration: 0.3 }
              },
              ...bounceAnimation
            }}
            onClick={handlePlayClick}
          >
            <BsPlayFill />
          </PlayButton>
          <RippleContainer>
            <AnimatePresence>
              {isRippling && (
                <Ripple
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: [1, 2, 3],
                    opacity: [0.5, 0.25, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                    times: [0, 0.5, 1]
                  }}
                  onAnimationComplete={() => setIsRippling(false)}
                />
              )}
            </AnimatePresence>
          </RippleContainer>
        </PlayButtonWrapper>
      </HomeContainer>
      <VideoPlayer isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </PageTransition>
  );
};

export default Home;
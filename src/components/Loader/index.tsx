import { motion } from 'framer-motion';
import styled from 'styled-components';
import Logo from '../Logo';

const LoaderContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.primary};
  z-index: 9999;
`;

const LoaderContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 0 2.2rem;
`;

const Subheader = styled(motion.p)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.25rem;
  letter-spacing: 0.02em;
  font-weight: 300;
`;

const StatusBarContainer = styled.div`
  width: 300px;
  height: 4px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
`;

const StatusBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary} 0%,
    #a5d4e4 25%,
    #d4a373 50%,
    #73d4a3 75%,
    ${({ theme }) => theme.colors.primary} 100%
  );
  background-size: 200% 100%;
`;

const Loader = () => {
  return (
    <LoaderContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <LoaderContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Logo size="large" />
        </motion.div>

        <StatusBarContainer>
          <StatusBar
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </StatusBarContainer>

        <Subheader
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          Where to go for wisdom
        </Subheader>
      </LoaderContent>
    </LoaderContainer>
  );
};

export default Loader;
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LogoContainer = styled(motion.div)<{ $size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ $size }) =>
    $size === 'small' ? '0.75rem' :
    $size === 'medium' ? '1rem' :
    '2rem'
  };
`;

const StyledSvg = styled(motion.svg)<{ $size?: 'small' | 'medium' | 'large' }>`
  width: ${({ $size }) =>
    $size === 'small' ? '48px' :
    $size === 'medium' ? '64px' :
    '160px'
  };
  height: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: ${({ $size }) =>
      $size === 'small' ? '40px' :
      $size === 'medium' ? '56px' :
      '120px'
    };
  }
`;

const LogoText = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: ${({ $size }) =>
    $size === 'small' ? '1.25rem' :
    $size === 'medium' ? '1.75rem' :
    '4rem'
  };
  font-weight: 400;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: wrap;
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ $size }) =>
      $size === 'small' ? '1.125rem' :
      $size === 'medium' ? '1.5rem' :
      '3rem'
    };
  }
`;

const GradientDefs = styled.defs`
  @keyframes gradientShift {
    0% {
      stop-color: ${({ theme }) => theme.colors.primary};
    }
    25% {
      stop-color: #a5d4e4;
    }
    50% {
      stop-color: #d4a373;
    }
    75% {
      stop-color: #73d4a3;
    }
    100% {
      stop-color: ${({ theme }) => theme.colors.primary};
    }
  }

  #gradient-start {
    animation: gradientShift 8s infinite;
  }

  #gradient-end {
    animation: gradientShift 8s infinite reverse;
  }
`;

const pathVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

const rotateVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      ease: "linear",
      repeat: Infinity
    }
  }
};

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'large', showText = true, className }) => {
  return (
    <LogoContainer
      $size={size}
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <StyledSvg
        $size={size}
        viewBox="0 0 100 100"
        animate="animate"
        variants={rotateVariants}
      >
        <GradientDefs>
          <linearGradient id="flower-gradient" gradientTransform="rotate(90)">
            <stop id="gradient-start" offset="0%" />
            <stop id="gradient-end" offset="100%" />
          </linearGradient>
        </GradientDefs>

        {/* Floral Pattern - 8 petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
          <motion.path
            key={rotation}
            d="M50,50 Q70,30 50,10 Q30,30 50,50 Z"
            fill="none"
            stroke="url(#flower-gradient)"
            strokeWidth="1"
            transform={`rotate(${rotation} 50 50)`}
            initial="hidden"
            animate="visible"
            variants={pathVariants}
            transition={{
              ...pathVariants.visible.transition,
              delay: index * 0.2
            }}
          />
        ))}
      </StyledSvg>

      {showText && (
        <LogoText
          $size={size}
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Sage Advice
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default Logo;
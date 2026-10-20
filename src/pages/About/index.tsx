import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import Logo from '../../components/Logo';
import { Eyebrow, Button } from '../../components/ui';
import { springSoft } from '../../styles/motion';

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  gap: 2.5rem;
  padding-block: 1rem 2rem;
`;

const Hero = styled.div`
  display: grid;
  justify-items: center;
  gap: 1.25rem;
  text-align: center;
`;

const Tagline = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 300;
  font-variation-settings: 'SOFT' 80;
  font-size: clamp(1.4rem, 3.6vw, 1.9rem);
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.ink2};
  max-width: 28ch;
  text-wrap: balance;
`;

const Body = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const Paragraph = styled(motion.p)`
  font-size: 1.08rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.ink2};
  max-width: 62ch;

  strong {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

const Principles = styled.dl`
  display: grid;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  div {
    display: grid;
    grid-template-columns: 9rem 1fr;
    gap: 1rem;
    align-items: baseline;
  }

  dt {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.ink};
  }

  dd {
    color: ${({ theme }) => theme.colors.ink2};
    font-size: 0.98rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    div {
      grid-template-columns: 1fr;
      gap: 0.2rem;
    }
  }
`;

const Cta = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
`;

const About = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <Container>
        <Hero>
          <Logo size="medium" showText={false} />
          <Eyebrow>Sage Advice</Eyebrow>
          <h1>Where to go for wisdom</h1>
          <Tagline>One line a day, a short worth watching, and a place to be still.</Tagline>
        </Hero>

        <Body>
          <Paragraph initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: 0.15 }}>
            We live in a world overwhelmed by crises: ecological, political, economic and social. As trust in our institutions erodes, it can be hard to find somewhere to turn for wisdom and hope. <strong>Sage Advice</strong> is meant to be that place. A small sanctuary where you can find perspective, steadiness and a reminder that life is worth living well.
          </Paragraph>
          <Paragraph initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: 0.3 }}>
            The clips here are chosen by hand. Not watered-down platitudes, but ideas from people who thought carefully about how to live, offered in under a minute so you can carry one into your day and actually practise it.
          </Paragraph>

          <Principles>
            <div>
              <dt>Curated</dt>
              <dd>Every short is picked and credited. You always see who is speaking and where it came from.</dd>
            </div>
            <div>
              <dt>Unhurried</dt>
              <dd>No feed, no streaks, no badges. One line, one short, and the choice to keep it.</dd>
            </div>
            <div>
              <dt>Yours</dt>
              <dd>What you love and what you write stays on your device.</dd>
            </div>
          </Principles>
        </Body>

        <Cta>
          <Button onClick={() => navigate('/')} whileTap={{ scale: 0.97 }}>
            Begin <ArrowRight />
          </Button>
        </Cta>
      </Container>
    </PageTransition>
  );
};

export default About;

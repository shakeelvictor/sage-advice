import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sun, Moon, Monitor } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import Logo from '../../components/Logo';
import { MintButton, Chip, Surface, ForestCard } from '../../components/ui';
import { useTheme, themeLabel } from '../../context/theme';
import { useCalmBackground } from '../../utils/ground';
import { springSoft } from '../../styles/motion';

const Container = styled.div`
  max-width: 680px;
  margin: 0 auto;
  display: grid;
  gap: 1.75rem;
  padding-block: 0.25rem 1rem;

  > * {
    min-width: 0;
  }
`;

/* The page's one forest block: what Sage Advice is for, and the way in. */
const Hero = styled(ForestCard)`
  display: grid;
  justify-items: center;
  gap: 1rem;
  text-align: center;
  padding-block: 2rem;
  color: ${({ theme }) => theme.colors.onForest};

  small {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.mint};
  }

  h1 {
    font-size: clamp(1.8rem, 7vw, 2.4rem);
    letter-spacing: -0.035em;
    color: ${({ theme }) => theme.colors.onForest};
  }
`;

const Tagline = styled.p`
  font-size: 1.05rem;
  line-height: 1.45;
  color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 82%, transparent);
  max-width: 30ch;
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
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: var(--radius-l);
  box-shadow: ${({ theme }) => theme.shadows.card};

  div {
    display: grid;
    grid-template-columns: 9rem 1fr;
    gap: 1rem;
    align-items: baseline;
  }

  dt {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.ink};
  }

  dt::before {
    content: '';
    flex: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.ember};
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

const Settings = styled(Surface)`
  display: grid;
  gap: 0.9rem;
  padding: 1.25rem;

  h2 {
    font-size: 1rem;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.ink2};
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const THEMES = [
  { id: 'light', Icon: Sun },
  { id: 'dark', Icon: Moon },
  { id: 'system', Icon: Monitor },
] as const;

/* The mark in mint on the forest block. */
const LogoOnForest = styled(Logo)`
  color: ${({ theme }) => theme.colors.mint};
`;

const About = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [calm, setCalm] = useCalmBackground();

  return (
    <PageTransition>
      <Container>
        <Hero aria-labelledby="about-heading" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={springSoft}>
          <LogoOnForest size="medium" showText={false} />
          <small>Sage Advice</small>
          <h1 id="about-heading">Where to go for wisdom</h1>
          <Tagline>One line a day, a short worth watching, and a place to be still.</Tagline>
          <MintButton onClick={() => navigate('/')} whileTap={{ scale: 0.97 }}>
            Begin <ArrowRight aria-hidden />
          </MintButton>
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

        <Settings as="section" aria-labelledby="appearance-heading">
          <h2 id="appearance-heading">Appearance</h2>
          <ChipRow role="group" aria-label="Theme">
            {THEMES.map(({ id, Icon }) => (
              <Chip key={id} $active={theme === id} aria-pressed={theme === id} onClick={() => setTheme(id)}>
                <Icon aria-hidden /> {themeLabel[id]}
              </Chip>
            ))}
          </ChipRow>
          <h2 id="calm-heading">Calm background</h2>
          <ChipRow role="group" aria-labelledby="calm-heading">
            <Chip $active={calm} aria-pressed={calm} onClick={() => setCalm(true)}>
              On
            </Chip>
            <Chip $active={!calm} aria-pressed={!calm} onClick={() => setCalm(false)}>
              Off
            </Chip>
          </ChipRow>
          <p>A slow drift of colour behind every screen. Off, or with reduced motion set on your device, it stays still.</p>
        </Settings>

      </Container>
    </PageTransition>
  );
};

export default About;

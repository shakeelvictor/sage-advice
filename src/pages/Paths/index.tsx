import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Users } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, PageHeader, PageTitle, PageIntro } from '../../components/ui';
import { paths } from '../../data/paths';
import { useAppSelector } from '../../hooks/useAppSelector';
import { spring } from '../../styles/motion';

const Container = styled.div`
  max-width: 680px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;

  > * {
    min-width: 0;
  }
`;

const List = styled(motion.div)`
  display: grid;
  gap: 1rem;
`;

const MotionLink = motion(Link);

/* Cards are links; their surface styles live here because \`as\` would drop a wrapped Surface's. */
const Card = styled(MotionLink)`
  display: grid;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: var(--radius-l);
  box-shadow: ${({ theme }) => theme.shadows.card};
  gap: 0.6rem;
  padding: 1.35rem 1.35rem 1.2rem;
  color: inherit;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s ease;

  h2 {
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    font-size: 0.95rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.float};
  }
`;

const Foot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
`;

/* Walked = the action color. Current = mint with a sage ring, since a mint ring alone is 1.2:1 on white. */
const Dot = styled.span<{ $state: 'done' | 'current' | 'later' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $state, theme }) => ($state === 'done' ? theme.colors.action : $state === 'current' ? theme.colors.mint : `color-mix(in srgb, ${theme.colors.sage} 22%, ${theme.colors.surface})`)};
  box-shadow: ${({ $state, theme }) => ($state === 'current' ? `0 0 0 2px ${theme.colors.surface}, 0 0 0 3.5px ${theme.colors.sage}` : 'none')};
`;

/* Styled like the forest pill, but a span: the whole card is already the link. */
const Pill = styled.span<{ $finished?: boolean }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 40px;
  padding: 0 1.1rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.88rem;
  background: ${({ $finished, theme }) => ($finished ? theme.colors.surface2 : theme.colors.action)};
  color: ${({ $finished, theme }) => ($finished ? theme.colors.ink2 : theme.colors.onAction)};

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }
`;

const Voices = styled(MotionLink)`
  display: grid;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: var(--radius-l);
  box-shadow: ${({ theme }) => theme.shadows.card};
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  padding: 1.1rem 1.2rem;
  color: inherit;
  transition: transform 0.3s var(--ease-out);

  .tile {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-s);
    background: ${({ theme }) => theme.colors.mint};
    color: ${({ theme }) => theme.colors.onMint};
  }

  .tile svg,
  > svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
  }

  > svg {
    color: ${({ theme }) => theme.colors.ink3};
  }

  strong {
    display: block;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  small {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.ink2};
  }

  &:hover {
    transform: translateY(-1px);
  }
`;

const list = { show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: spring } };

const Paths = () => {
  const progress = useAppSelector((s) => s.paths.progress);

  return (
    <PageTransition>
      <Container>
        <PageHeader style={{ marginBottom: '0.5rem' }}>
          <Eyebrow>Walk a theme</Eyebrow>
          <PageTitle>Paths</PageTitle>
          <PageIntro>Short sequences on one theme, with a question to sit with after each. A step a day is plenty.</PageIntro>
        </PageHeader>

        <List initial="hidden" animate="show" variants={list}>
          {paths.map((path) => {
            const walked = progress[path.id]?.done ?? [];
            const finished = walked.length >= path.steps.length;
            const current = path.steps.findIndex((_, i) => !walked.includes(i));
            const label = finished ? 'Walked' : walked.length > 0 ? 'Continue' : 'Begin';
            return (
              <Card
                key={path.id}
                to={`/paths/${path.id}`}
                variants={item}
                aria-label={`${path.title}. ${walked.length} of ${path.steps.length} walked. ${label}.`}
              >
                <Eyebrow>{path.eyebrow}</Eyebrow>
                <h2>{path.title}</h2>
                <p>{path.intro}</p>
                <Foot>
                  <Dots aria-hidden>
                    {path.steps.map((_, i) => (
                      <Dot key={i} $state={walked.includes(i) ? 'done' : !finished && i === current ? 'current' : 'later'} />
                    ))}
                  </Dots>
                  <Pill $finished={finished} aria-hidden>
                    {finished && <Check />}
                    {label}
                    {!finished && <ArrowRight />}
                  </Pill>
                </Foot>
              </Card>
            );
          })}
        </List>

        <Voices to="/thinkers" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }}>
          <span className="tile" aria-hidden>
            <Users />
          </span>
          <span>
            <strong>Or browse by voice</strong>
            <small>Who is speaking, from which tradition, and all they said here.</small>
          </span>
          <ArrowRight aria-hidden />
        </Voices>
      </Container>
    </PageTransition>
  );
};

export default Paths;

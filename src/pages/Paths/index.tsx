import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, PageHeader, PageTitle, PageIntro, Surface } from '../../components/ui';
import { paths } from '../../data/paths';
import { useAppSelector } from '../../hooks/useAppSelector';
import { spring } from '../../styles/motion';

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 1.25rem;
  align-items: stretch;
`;

const Card = styled(motion(Surface))`
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 1.35rem;
  min-width: 0;
  color: inherit;
  transition: border-color 0.25s ease, transform 0.3s var(--ease-out), box-shadow 0.3s ease;

  h2 {
    font-size: 1.7rem;
    font-variation-settings: 'SOFT' 60;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    font-size: 0.96rem;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.moss};
    transform: translateY(-2px);
    box-shadow: 0 24px 50px -30px rgba(0, 0, 0, 0.5);
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
`;

const Dot = styled.span<{ $done?: boolean; $next?: boolean }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $done, theme }) => ($done ? theme.colors.amber : 'transparent')};
  border: 1.5px solid ${({ $done, $next, theme }) => ($done || $next ? theme.colors.amber : theme.colors.line)};
`;

const Action = styled.span<{ $finished?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 700;
  font-size: 0.88rem;
  color: ${({ $finished, theme }) => ($finished ? theme.colors.sage : theme.colors.amber)};

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }
`;

const Voices = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  padding: 1.5rem 1.6rem;
  border-radius: var(--radius-l);
  border: 1px dashed ${({ theme }) => theme.colors.moss};
  color: inherit;
  transition: border-color 0.25s ease, background-color 0.25s ease;

  h2 {
    font-size: 1.5rem;
    margin-top: 0.2rem;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    font-size: 0.95rem;
    max-width: 52ch;
  }

  &:hover {
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.amber};
    background: color-mix(in srgb, ${({ theme }) => theme.colors.amber} 5%, transparent);
  }
`;

const list = { show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: spring } };

const Paths = () => {
  const progress = useAppSelector((s) => s.paths.progress);

  return (
    <PageTransition>
      <Container>
        <PageHeader>
          <Eyebrow>Walk a theme</Eyebrow>
          <PageTitle>Paths</PageTitle>
          <PageIntro>Short sequences on one theme, with a question to sit with after each. Walk them at your own pace. A step a day is plenty.</PageIntro>
        </PageHeader>

        <Grid as={motion.div} initial="hidden" animate="show" variants={list}>
          {paths.map((path) => {
            const done = progress[path.id]?.done.length ?? 0;
            const finished = done >= path.steps.length;
            const label = finished ? 'Walked' : done > 0 ? `Continue · ${done} of ${path.steps.length}` : 'Begin';
            return (
              <Card key={path.id} as={Link} to={`/paths/${path.id}`} variants={item} aria-label={`${path.title}, ${label}`}>
                <Eyebrow>{path.eyebrow}</Eyebrow>
                <h2>{path.title}</h2>
                <p>{path.intro}</p>
                <Foot>
                  <Dots aria-hidden>
                    {path.steps.map((_, i) => (
                      <Dot key={i} $done={progress[path.id]?.done.includes(i)} $next={!finished && i === done} />
                    ))}
                  </Dots>
                  <Action $finished={finished}>
                    {finished ? <Check /> : null}
                    {label}
                    {!finished && <ArrowRight />}
                  </Action>
                </Foot>
              </Card>
            );
          })}
        </Grid>

        <Voices to="/thinkers">
          <div>
            <Eyebrow>Or browse by voice</Eyebrow>
            <h2>Thinkers</h2>
            <p>Who is speaking in these shorts, from which tradition, and everything else they said here.</p>
          </div>
          <Action>
            Browse <ArrowRight />
          </Action>
        </Voices>
      </Container>
    </PageTransition>
  );
};

export default Paths;

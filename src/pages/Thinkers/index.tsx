import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, ForestCard } from '../../components/ui';
import { voicesByTradition, thinkerSlug } from '../../data/thinkers';
import { videos } from '../../data/videos';
import { spring } from '../../styles/motion';

const Container = styled.div`
  max-width: 980px;
  margin: 0 auto;
  display: grid;
  gap: 2.25rem;

  > * {
    min-width: 0;
  }
`;

/* The page's one forest block: who is in the library, at a glance. */
const Summary = styled(ForestCard)`
  display: grid;
  gap: 0.6rem;

  small {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.mint};
  }

  h1 {
    font-size: clamp(1.7rem, 6.5vw, 2.3rem);
    letter-spacing: -0.035em;
    color: ${({ theme }) => theme.colors.onForest};
  }

  h1 span {
    font-weight: 400;
    color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 72%, transparent);
  }

  p {
    color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 78%, transparent);
    max-width: 56ch;
  }
`;

const Group = styled.section`
  display: grid;
  gap: 1rem;
`;

const GroupHead = styled.div`
  display: grid;
  gap: 0.35rem;
  max-width: 62ch;

  h2 {
    font-size: 1.3rem;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    font-size: 0.95rem;
  }
`;

const AllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.2rem;
  justify-self: start;

  svg {
    width: 15px;
    height: 15px;
    stroke-width: 2;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 0.9rem;
`;

/* Cards are links, so their surface styles live here rather than on a wrapped Surface. */
const Card = styled(motion(Link))`
  display: grid;
  gap: 0.4rem;
  padding: 1.1rem 1.2rem;
  color: inherit;
  min-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: var(--radius-l);
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s ease;

  h3 {
    font-weight: 600;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  small {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.ink3};
  }

  p {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.ink2};
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

const Count = styled.span`
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.emberInk};
`;

const list = { show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: spring } };

const Thinkers = () => {
  const groups = voicesByTradition();
  const voiceCount = groups.reduce((n, g) => n + g.thinkers.length, 0);

  return (
    <PageTransition>
      <Container>
        <Summary aria-labelledby="thinkers-heading" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <small>Thinkers</small>
          <h1 id="thinkers-heading">
            {voiceCount} voices, <span>{groups.length} traditions.</span>
          </h1>
          <p>Who is speaking across {videos.length} shorts, and from which tradition. Every short is credited to the person whose idea it carries, when that is clear.</p>
        </Summary>

        {groups.map(({ tradition, thinkers, unattributed }) => (
          <Group key={tradition.id}>
            <GroupHead>
              <Eyebrow>{tradition.label}</Eyebrow>
              <h2>{tradition.label}</h2>
              <p>{tradition.blurb}</p>
              <AllLink to={`/traditions/${tradition.id}`}>
                All {tradition.label.toLowerCase()} shorts{unattributed > 0 ? `, including ${unattributed} from the tradition at large` : ''} <ArrowRight />
              </AllLink>
            </GroupHead>
            {thinkers.length > 0 && (
              <Grid initial="hidden" animate="show" variants={list}>
                {thinkers.map((t) => (
                  <Card key={t.name} to={`/thinkers/${thinkerSlug(t.name)}`} variants={item}>
                    <Count>
                      {t.count} {t.count === 1 ? 'short' : 'shorts'}
                    </Count>
                    <h3>{t.name}</h3>
                    {t.dates && <small>{t.dates}</small>}
                    {t.bio && <p>{t.bio}</p>}
                  </Card>
                ))}
              </Grid>
            )}
          </Group>
        ))}
      </Container>
    </PageTransition>
  );
};

export default Thinkers;

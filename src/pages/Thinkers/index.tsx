import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, PageHeader, PageTitle, PageIntro, Surface } from '../../components/ui';
import { voicesByTradition, thinkerSlug } from '../../data/thinkers';
import { spring } from '../../styles/motion';

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 2.5rem;
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
    font-size: 1.6rem;
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
  font-weight: 700;
  margin-top: 0.2rem;

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

const Card = styled(motion(Surface))`
  display: grid;
  gap: 0.4rem;
  padding: 1.1rem 1.2rem;
  color: inherit;
  min-width: 0;
  transition: border-color 0.25s ease, transform 0.3s var(--ease-out);

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    font-size: 1.3rem;
    line-height: 1.15;
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
    border-color: ${({ theme }) => theme.colors.moss};
    transform: translateY(-2px);
  }
`;

const Count = styled.span`
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
`;

const list = { show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: spring } };

const Thinkers = () => {
  const groups = voicesByTradition();

  return (
    <PageTransition>
      <Container>
        <PageHeader style={{ marginBottom: 0 }}>
          <Eyebrow>Voices</Eyebrow>
          <PageTitle>Thinkers</PageTitle>
          <PageIntro>Who is speaking, and from which tradition. Every short is credited to the person whose idea it carries, when that is clear.</PageIntro>
        </PageHeader>

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
                  <Card key={t.name} as={Link} to={`/thinkers/${thinkerSlug(t.name)}`} variants={item}>
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

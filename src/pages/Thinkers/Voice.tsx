import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import ShortCard from '../../components/ShortCard';
import { Eyebrow } from '../../components/ui';
import { Video } from '../../data/videos';
import { Tradition, TRADITIONS, thinkerBySlug, traditionMeta, videosByThinker, videosByTradition } from '../../data/thinkers';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { markPracticed } from '../../store/ritualSlice';
import { todayKey } from '../../utils/ritual';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink2};

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.amber};
  }
`;

const Head = styled.header`
  display: grid;
  gap: 0.6rem;
  max-width: 64ch;

  h1 {
    font-size: clamp(2.1rem, 5vw, 3rem);
    font-variation-settings: 'SOFT' 60;
  }

  small {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.ink3};
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    font-size: 1.02rem;
  }
`;

const TraditionLink = styled(Link)`
  font-size: 0.85rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1.1rem;
  align-items: start;
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.ink2};
`;

const usePlayer = () => {
  const dispatch = useAppDispatch();
  const [playing, setPlaying] = useState<Video | null>(null);
  const close = useCallback(() => setPlaying(null), []);
  const ended = useCallback(() => {
    dispatch(markPracticed(todayKey()));
    setPlaying(null);
  }, [dispatch]);
  return { playing, setPlaying, close, ended };
};

const Sheet = ({ playing, close, ended }: ReturnType<typeof usePlayer>) => (
  <AnimatePresence>{playing && <PlayerSheet key={playing.id} video={playing} onClose={close} onEnded={ended} />}</AnimatePresence>
);

export const ThinkerPage = () => {
  const { thinkerId = '' } = useParams();
  const thinker = thinkerBySlug(thinkerId);
  const player = usePlayer();

  if (!thinker) return <Navigate to="/thinkers" replace />;
  const shorts = videosByThinker(thinker.name);
  const tradition = traditionMeta(thinker.tradition);

  return (
    <PageTransition>
      <Container>
        <Back to="/thinkers">
          <ArrowLeft /> All thinkers
        </Back>
        <Head>
          {tradition && <Eyebrow as={TraditionLink} to={`/traditions/${tradition.id}`}>{tradition.label}</Eyebrow>}
          <h1>{thinker.name}</h1>
          {thinker.dates && <small>{thinker.dates}</small>}
          {thinker.bio ? <p>{thinker.bio}</p> : <p>Featured in {shorts.length} {shorts.length === 1 ? 'short' : 'shorts'} in the library.</p>}
        </Head>
        {shorts.length === 0 ? (
          <Empty>No shorts from this voice yet.</Empty>
        ) : (
          <Grid>
            {shorts.map((v) => (
              <ShortCard key={v.id} video={v} onPlay={player.setPlaying} hideThinker />
            ))}
          </Grid>
        )}
        <Sheet {...player} />
      </Container>
    </PageTransition>
  );
};

export const TraditionPage = () => {
  const { tradition = '' } = useParams();
  const meta = TRADITIONS.find((t) => t.id === (tradition as Tradition));
  const player = usePlayer();

  if (!meta) return <Navigate to="/thinkers" replace />;
  const shorts = videosByTradition(meta.id);

  return (
    <PageTransition>
      <Container>
        <Back to="/thinkers">
          <ArrowLeft /> All thinkers
        </Back>
        <Head>
          <Eyebrow>Tradition</Eyebrow>
          <h1>{meta.label}</h1>
          <p>{meta.blurb}</p>
        </Head>
        {shorts.length === 0 ? (
          <Empty>Nothing from this tradition in the library yet.</Empty>
        ) : (
          <Grid>
            {shorts.map((v) => (
              <ShortCard key={v.id} video={v} onPlay={player.setPlaying} />
            ))}
          </Grid>
        )}
        <Sheet {...player} />
      </Container>
    </PageTransition>
  );
};

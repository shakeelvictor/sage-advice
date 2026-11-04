import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import ShortCard from '../../components/ShortCard';
import WisdomCardModal from '../../components/WisdomCardModal';
import { ForestCard } from '../../components/ui';
import { Video } from '../../data/videos';
import { Tradition, TRADITIONS, thinkerBySlug, traditionMeta, videosByThinker, videosByTradition } from '../../data/thinkers';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logPractice } from '../../store/ritualSlice';

const Container = styled.div`
  max-width: 980px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;

  > * {
    min-width: 0;
  }
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink2};
  justify-self: start;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

/* The page's one forest block: who this is, or what the tradition holds. */
const Head = styled(ForestCard)`
  display: grid;
  gap: 0.6rem;

  .eyebrow {
    justify-self: start;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.mint};
  }

  a.eyebrow:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  h1 {
    font-size: clamp(1.9rem, 7vw, 2.6rem);
    letter-spacing: -0.035em;
    color: ${({ theme }) => theme.colors.onForest};
  }

  small {
    font-size: 0.9rem;
    color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 72%, transparent);
  }

  p {
    color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 84%, transparent);
    font-size: 1.02rem;
    max-width: 62ch;
  }

  .count {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ember};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1rem;
  align-items: start;
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.ink2};
`;

const usePlayer = () => {
  const dispatch = useAppDispatch();
  const [playing, setPlaying] = useState<Video | null>(null);
  const [sharing, setSharing] = useState<Video | null>(null);
  const close = useCallback(() => setPlaying(null), []);
  const closeShare = useCallback(() => setSharing(null), []);
  const ended = useCallback(() => {
    if (playing) dispatch(logPractice({ kind: 'watch', at: Date.now(), id: playing.id }));
    setPlaying(null);
  }, [dispatch, playing]);
  return { playing, setPlaying, close, ended, sharing, setSharing, closeShare };
};

const Sheet = ({ playing, close, ended, sharing, closeShare }: ReturnType<typeof usePlayer>) => (
  <>
    <AnimatePresence>{playing && <PlayerSheet key={playing.id} video={playing} onClose={close} onEnded={ended} />}</AnimatePresence>
    <WisdomCardModal video={sharing} onClose={closeShare} />
  </>
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
        <Head as="header">
          {tradition && (
            <Link className="eyebrow" to={`/traditions/${tradition.id}`}>
              {tradition.label}
            </Link>
          )}
          <h1>{thinker.name}</h1>
          {thinker.dates && <small>{thinker.dates}</small>}
          {thinker.bio && <p>{thinker.bio}</p>}
          <span className="count">
            {shorts.length} {shorts.length === 1 ? 'short' : 'shorts'} in the library
          </span>
        </Head>
        {shorts.length === 0 ? (
          <Empty>No shorts from this voice yet.</Empty>
        ) : (
          <Grid>
            {shorts.map((v) => (
              <ShortCard key={v.id} video={v} onPlay={player.setPlaying} onShare={player.setSharing} hideThinker />
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
        <Head as="header">
          <span className="eyebrow">Tradition</span>
          <h1>{meta.label}</h1>
          <p>{meta.blurb}</p>
          <span className="count">
            {shorts.length} {shorts.length === 1 ? 'short' : 'shorts'} in the library
          </span>
        </Head>
        {shorts.length === 0 ? (
          <Empty>Nothing from this tradition in the library yet.</Empty>
        ) : (
          <Grid>
            {shorts.map((v) => (
              <ShortCard key={v.id} video={v} onPlay={player.setPlaying} onShare={player.setSharing} />
            ))}
          </Grid>
        )}
        <Sheet {...player} />
      </Container>
    </PageTransition>
  );
};

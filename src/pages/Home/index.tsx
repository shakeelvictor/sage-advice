import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Heart, RotateCcw, SkipForward, Shuffle, Undo2 } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import IntentPicker from '../../components/IntentPicker';
import { Eyebrow, Button, IconButton, TextButton, Surface, Chip } from '../../components/ui';
import { videos, Video } from '../../data/videos';
import { Intent, intentLabel, pickAnother, pickDaily, todayKey } from '../../utils/ritual';
import { thinkerSlug } from '../../data/thinkers';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { addVideo, removeVideo } from '../../store/lovedVideosSlice';
import { markPracticed, setToday } from '../../store/ritualSlice';
import { spring, springSoft } from '../../styles/motion';

type Stage = 'intent' | 'line' | 'watch' | 'after';

const WORD_STAGGER = 0.085;
const WORD_DELAY = 0.35;

const Scene = styled.div`
  position: relative;
  min-height: calc(100vh - var(--nav-h) - 4rem);
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
  max-width: 680px;
  margin: 0 auto;
  padding-block: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: calc(100vh - 6rem);
  }
`;

const Orb = styled(motion.div)`
  position: absolute;
  left: 50%;
  top: 34%;
  width: min(70vw, 420px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow), transparent 68%);
  filter: blur(14px);
  pointer-events: none;
  z-index: -1;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  min-height: 36px;

  /* Clear the floating theme button on phones. */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-right: 3.25rem;
  }
`;

const Centre = styled.div`
  display: grid;
  align-content: center;
  gap: 1.25rem;
`;

const Line = styled(motion.p)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 300;
  font-variation-settings: 'SOFT' 80;
  font-size: clamp(1.75rem, 4.6vw, 2.9rem);
  line-height: 1.22;
  letter-spacing: -0.012em;
  text-wrap: balance;
  color: ${({ theme }) => theme.colors.ink};
`;

const Word = styled(motion.span)`
  display: inline-block;
  white-space: pre;
`;

const Attribution = styled(motion.div)`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.ink2};

  strong {
    color: ${({ theme }) => theme.colors.ink};
    font-weight: 700;
  }

  a strong {
    border-bottom: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.amber} 50%, transparent);
    transition: border-color 0.25s ease, color 0.25s ease;
  }

  a:hover strong {
    color: ${({ theme }) => theme.colors.amber};
    border-color: ${({ theme }) => theme.colors.amber};
  }
`;

const Prompt = styled(motion.p)`
  font-size: 1.02rem;
  color: ${({ theme }) => theme.colors.ink2};
  border-left: 2px solid ${({ theme }) => theme.colors.amber};
  padding-left: 1rem;
  max-width: 48ch;
`;

const Card = styled(motion(Surface))`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.9rem;
`;

const Thumb = styled.button`
  position: relative;
  width: 72px;
  aspect-ratio: 9 / 16;
  border-radius: var(--radius-m);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface2};
  display: grid;
  place-items: center;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
  }

  span {
    position: relative;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${({ theme }) => theme.colors.amber};
    color: ${({ theme }) => theme.colors.onAmber};
    box-shadow: 0 0 0 6px color-mix(in srgb, ${({ theme }) => theme.colors.amber} 25%, transparent);
  }

  svg {
    width: 16px;
    height: 16px;
    margin-left: 2px;
  }
`;

const CardBody = styled.div`
  min-width: 0;
  display: grid;
  gap: 0.25rem;

  strong {
    font-size: 0.98rem;
    line-height: 1.3;
  }

  small {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.ink3};
    text-transform: capitalize;
  }
`;

const CardActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const AfterControls = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.ink3};
  font-size: 0.8rem;
  text-align: center;
`;

const Done = styled(Surface)`
  padding: 2rem;
  text-align: center;
  display: grid;
  gap: 0.75rem;
  justify-items: center;

  p {
    color: ${({ theme }) => theme.colors.ink2};
  }
`;

const wordVariants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.2, 0.7, 0.2, 1] } },
};

const weekday = () => new Date().toLocaleDateString(undefined, { weekday: 'long' });
const byId = (id: string) => videos.find((v) => v.id === id);

const Home = () => {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.lovedVideos.videos);
  const ritual = useAppSelector((s) => s.ritual);
  const savedIds = useMemo(() => saved.map((v) => v.id), [saved]);
  const date = todayKey();

  const today = ritual.today?.date === date ? ritual.today : null;
  const intent = today?.intent ?? null;
  const dailyVideo = useMemo(() => (today ? byId(today.videoId) : undefined), [today]);

  const [video, setVideo] = useState<Video | null>(dailyVideo ?? null);
  const [stage, setStage] = useState<Stage>(dailyVideo ? 'line' : 'intent');
  const [watched, setWatched] = useSessionStorage<string[]>('watchedVideos', []);
  const [seenBefore, setSeenBefore] = useState(false);

  // A new day, or a stored pick that no longer exists in the library, asks the question again.
  useEffect(() => {
    if (!dailyVideo && stage !== 'intent') setStage('intent');
  }, [dailyVideo, stage]);

  const isSaved = video ? savedIds.includes(video.id) : false;
  const isWandering = video !== null && dailyVideo !== undefined && video.id !== dailyVideo.id;
  const allLoved = saved.length >= videos.length;
  const words = video?.wisdom.split(' ') ?? [];
  const settleAt = WORD_DELAY + words.length * WORD_STAGGER + 0.15;
  const practiceDays = ritual.practiceDays.length;

  const choose = useCallback(
    (picked: Intent | null) => {
      const chosen = pickDaily(date, picked, savedIds);
      dispatch(setToday({ date, intent: picked, videoId: chosen.id }));
      setVideo(chosen);
      setStage('line');
    },
    [date, dispatch, savedIds],
  );

  const wander = useCallback(() => {
    setVideo((current) => pickAnother(intent, current?.id ?? '', savedIds));
    setStage('line');
  }, [intent, savedIds]);

  const backToToday = useCallback(() => {
    if (dailyVideo) {
      setVideo(dailyVideo);
      setStage('line');
    }
  }, [dailyVideo]);

  const love = useCallback(() => {
    if (!video) return;
    if (isSaved) {
      dispatch(removeVideo(video.id));
      return;
    }
    dispatch(addVideo({ ...video, notes: '', savedAt: Date.now() }));
    window.setTimeout(wander, 700);
  }, [dispatch, isSaved, video, wander]);

  const watch = () => {
    if (!video) return;
    setSeenBefore(watched.includes(video.id));
    if (!watched.includes(video.id)) setWatched([...watched, video.id]);
    setStage('watch');
  };

  const closePlayer = useCallback(() => setStage('line'), []);
  const endPlayer = useCallback(() => {
    dispatch(markPracticed(date));
    setStage('after');
  }, [date, dispatch]);

  if (allLoved) {
    return (
      <PageTransition>
        <Scene>
          <Centre>
            <Done>
              <Eyebrow>Every line, kept</Eyebrow>
              <h2>You have loved the whole library.</h2>
              <p>Revisit what stayed with you. New shorts arrive as the library grows.</p>
              <Button as={Link} to="/loved">Open Loved</Button>
            </Done>
          </Centre>
        </Scene>
      </PageTransition>
    );
  }

  const eyebrow = stage === 'after' ? 'Sit with it' : isWandering ? 'Wandering' : "Today's sage";

  return (
    <PageTransition>
      <Scene>
        <Orb style={{ x: '-50%', y: '-50%' }} animate={{ scale: [1, 1.14, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />

        <TopRow>
          <Eyebrow as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {eyebrow} · {weekday()}
          </Eyebrow>
          {stage !== 'intent' && (
            <Chip onClick={() => setStage('intent')} aria-label="Change what you need today" title="Change what you need today">
              {intent ? intentLabel(intent) : 'Surprise me'} · change
            </Chip>
          )}
        </TopRow>

        <Centre>
          <AnimatePresence mode="wait">
            {stage === 'intent' || !video ? (
              <IntentPicker key="intent" current={intent} onPick={choose} />
            ) : (
              <motion.div key={video.id + stage} style={{ display: 'grid', gap: '1.25rem' }} exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}>
                <Line initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: WORD_STAGGER, delayChildren: WORD_DELAY } } }}>
                  {words.map((w, i) => (
                    <Word key={`${w}-${i}`} variants={wordVariants}>
                      {w}{i < words.length - 1 ? ' ' : ''}
                    </Word>
                  ))}
                </Line>

                <Attribution initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: settleAt }}>
                  {video.thinker ? (
                    <Link to={`/thinkers/${thinkerSlug(video.thinker)}`}>
                      <strong>{video.thinker}</strong>
                    </Link>
                  ) : (
                    <strong>{video.title}</strong>
                  )}
                  {video.thinker && <> · {video.title}</>}
                  {video.creatorChannel && <> · via {video.creatorChannel}</>}
                </Attribution>

                {stage === 'after' && video.prompt && (
                  <Prompt initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: settleAt + 0.2 }}>
                    {video.prompt}
                  </Prompt>
                )}

                {stage === 'line' && (
                  <Card initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: settleAt + 0.35 }}>
                    <Thumb onClick={watch} aria-label={`Watch ${video.title}`}>
                      <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" />
                      <span><Play /></span>
                    </Thumb>
                    <CardBody>
                      <strong>{video.title}</strong>
                      <small>Short · {video.categories.join(' · ')}</small>
                    </CardBody>
                    <CardActions>
                      <Button onClick={watch} whileTap={{ scale: 0.97 }}>
                        <Play /> Watch the short
                      </Button>
                      {isWandering ? (
                        <TextButton onClick={backToToday}>
                          <Undo2 /> Back to today's line
                        </TextButton>
                      ) : (
                        <TextButton onClick={wander}>
                          <Shuffle /> Another line
                        </TextButton>
                      )}
                    </CardActions>
                  </Card>
                )}

                {stage === 'after' && (
                  <AfterControls initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: settleAt + 0.4 }}>
                    <IconButton $size={52} onClick={() => setStage('watch')} aria-label="Watch again" whileTap={{ scale: 0.9 }}>
                      <RotateCcw />
                    </IconButton>
                    <IconButton $tone={isSaved ? 'amber' : 'ghost'} $size={64} onClick={love} aria-label={isSaved ? 'Remove from loved' : 'Love this'} aria-pressed={isSaved} whileTap={{ scale: 0.9 }}>
                      <Heart fill={isSaved ? 'currentColor' : 'none'} />
                    </IconButton>
                    <IconButton $size={52} onClick={wander} aria-label="Another line" whileTap={{ scale: 0.9 }}>
                      <SkipForward />
                    </IconButton>
                  </AfterControls>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Centre>

        <Footer>
          {practiceDays > 0 && <span>{practiceDays} {practiceDays === 1 ? 'day' : 'days'} of practice</span>}
          {practiceDays > 0 && saved.length > 0 && <span aria-hidden>·</span>}
          {saved.length > 0 && <span>{saved.length} {saved.length === 1 ? 'line' : 'lines'} kept</span>}
          {practiceDays === 0 && saved.length === 0 && <span>Watch one short to the end and the day counts</span>}
        </Footer>

        <AnimatePresence>
          {stage === 'watch' && video && (
            <PlayerSheet
              key="player"
              video={video}
              onClose={closePlayer}
              onEnded={endPlayer}
              onNext={wander}
              onLove={love}
              isSaved={isSaved}
              seenBefore={seenBefore}
            />
          )}
        </AnimatePresence>
      </Scene>
    </PageTransition>
  );
};

export default Home;

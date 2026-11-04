import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Heart, RotateCcw, Share2, Sprout, ChevronRight, Shuffle, Undo2 } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import WisdomCardModal from '../../components/WisdomCardModal';
import { Eyebrow, Headline, Button, MintButton, IconButton, TextButton, Surface, Chip, ForestCard } from '../../components/ui';
import { videos, Video } from '../../data/videos';
import { paths } from '../../data/paths';
import { INTENTS, Intent, pickAnother, pickDaily, todayKey } from '../../utils/ritual';
import { thinkerSlug } from '../../data/thinkers';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { addVideo, removeVideo } from '../../store/lovedVideosSlice';
import { logPractice, setToday } from '../../store/ritualSlice';
import { spring, springSoft } from '../../styles/motion';
import { warmGround } from '../../utils/ground';

type Stage = 'line' | 'watch' | 'after';

const WORD_STAGGER = 0.085;
const WORD_DELAY = 0.25;

const Scene = styled.div`
  max-width: 680px;
  margin: 0 auto;
  display: grid;
  gap: 1.25rem;
  padding-block: 0.25rem 1rem;

  > * {
    min-width: 0;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 32px;
`;

const SproutMark = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.sage};

  svg {
    width: 17px;
    height: 17px;
    stroke-width: 2;
  }
`;

const Intents = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  margin-inline: -4px;
  padding: 4px;

  &::-webkit-scrollbar {
    display: none;
  }

  button {
    flex: none;
    padding: 0 0.95rem;
  }
`;

const Below = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: -0.5rem;
`;

const Card = styled(ForestCard)`
  display: grid;
  min-height: 300px;
  align-content: space-between;
`;

const CardBody = styled(motion.div)`
  display: grid;
  gap: 1.1rem;
`;

const Line = styled(motion.p)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-style: italic;
  font-weight: 300;
  font-variation-settings: 'opsz' 72, 'SOFT' 100;
  font-size: clamp(1.6rem, 6vw, 1.9rem);
  line-height: 1.24;
  letter-spacing: -0.01em;
  text-wrap: pretty;
  color: ${({ theme }) => theme.colors.onForest};
`;

const Word = styled(motion.span)`
  display: inline-block;
  white-space: pre;
`;

const Meta = styled(motion.div)`
  display: grid;
  gap: 0.15rem;
  font-size: 0.86rem;

  .who {
    font-weight: 600;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.mint};
    justify-self: start;
  }

  a.who:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .what {
    color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 72%, transparent);
  }
`;

const Prompt = styled(motion.div)`
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem 1rem;
  border-radius: var(--radius-m);
  background: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 8%, transparent);

  small {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.ember};
  }

  p {
    font-size: 1rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.onForest};
  }
`;

const Actions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;

  > button:first-child {
    padding: 0 1.15rem;
  }

  > button:last-child {
    margin-left: auto;
  }
`;

const OnForestText = styled(TextButton)`
  color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 82%, transparent);
  padding: 0 0.4rem;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.onForest};
  }
`;

const HeartWrap = styled.span`
  position: relative;
  display: grid;
  place-items: center;
`;

const Ripple = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.ember};
  pointer-events: none;
`;

const HeartButton = styled(IconButton)<{ $loved: boolean }>`
  ${({ $loved, theme }) => (!$loved ? `color: ${theme.colors.ember};` : '')}
`;

const PathCard = styled(Surface).attrs({ as: Link })`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  color: ${({ theme }) => theme.colors.ink};
  transition: transform 0.25s var(--ease-out);

  &:hover {
    transform: translateY(-1px);
  }

  .tile {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-s);
    background: ${({ theme }) => theme.colors.mint};
    color: ${({ theme }) => theme.colors.onMint};
  }

  .tile svg {
    width: 20px;
    height: 20px;
    stroke-width: 2;
  }

  .text {
    display: grid;
    min-width: 0;
  }

  strong {
    font-size: 0.98rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.ink2};
  }

  > svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.ink3};
  }
`;

const Footer = styled.p`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  padding-top: 0.25rem;
  color: ${({ theme }) => theme.colors.ink3};
  font-size: 0.84rem;
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.sage};
    font-weight: 600;
  }
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
const greeting = (hour = new Date().getHours()) =>
  hour < 5 ? 'Still up,' : hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
const byId = (id: string) => videos.find((v) => v.id === id);

const Home = () => {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.lovedVideos.videos);
  const ritual = useAppSelector((s) => s.ritual);
  const pathProgress = useAppSelector((s) => s.paths.progress);
  const savedIds = useMemo(() => saved.map((v) => v.id), [saved]);
  const date = todayKey();

  const today = ritual.today?.date === date ? ritual.today : null;
  const intent = today?.intent ?? null;
  const dailyVideo = useMemo(() => (today ? byId(today.videoId) : undefined), [today]);

  // No choice yet today: the line is today's surprise until an intent is picked.
  // savedIds is read once on purpose, so keeping a line does not swap today's line out from under you.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fallback = useMemo(() => pickDaily(date, null, savedIds), [date]);
  const todaysVideo = dailyVideo ?? fallback;

  const [video, setVideo] = useState<Video>(todaysVideo);
  const [stage, setStage] = useState<Stage>('line');
  const [watched, setWatched] = useSessionStorage<string[]>('watchedVideos', []);
  const [seenBefore, setSeenBefore] = useState(false);
  const [sharing, setSharing] = useState<Video | null>(null);
  const [ripple, setRipple] = useState(0);

  // Record today's surprise so it stays put across visits, and follow the day when it rolls over.
  useEffect(() => {
    if (!dailyVideo) {
      dispatch(setToday({ date, intent: null, videoId: fallback.id }));
      setVideo(fallback);
      setStage('line');
    }
  }, [dailyVideo, date, dispatch, fallback]);

  const isSaved = savedIds.includes(video.id);
  const isWandering = video.id !== todaysVideo.id;
  const allLoved = saved.length >= videos.length;
  const words = video.wisdom.split(' ');
  const settleAt = WORD_DELAY + words.length * WORD_STAGGER + 0.1;
  const practiceDays = ritual.practiceDays.length;

  /** The path walked most recently that still has steps left. */
  const continuing = useMemo(() => {
    const open = paths
      .map((path) => ({ path, progress: pathProgress[path.id] }))
      .filter(({ path, progress }) => progress && !progress.finishedAt && progress.done.length > 0 && progress.done.length < path.steps.length);
    const lastTouched = (p: (typeof open)[number]['progress']) => Math.max(p.startedAt, ...Object.values(p.completedAt ?? {}));
    return open.sort((a, b) => lastTouched(b.progress) - lastTouched(a.progress))[0];
  }, [pathProgress]);

  const choose = useCallback(
    (picked: Intent | null) => {
      if (picked === null && intent === null && !isWandering) {
        // Already on today's surprise: surprise again.
        setVideo((current) => pickAnother(null, current.id, savedIds));
      } else {
        const chosen = pickDaily(date, picked, savedIds);
        dispatch(setToday({ date, intent: picked, videoId: chosen.id }));
        setVideo(chosen);
      }
      setStage('line');
    },
    [date, dispatch, intent, isWandering, savedIds],
  );

  const wander = useCallback(() => {
    setVideo((current) => pickAnother(intent, current.id, savedIds));
    setStage('line');
  }, [intent, savedIds]);

  const backToToday = useCallback(() => {
    setVideo(todaysVideo);
    setStage('line');
  }, [todaysVideo]);

  const love = useCallback(() => {
    if (isSaved) {
      dispatch(removeVideo(video.id));
      return;
    }
    dispatch(addVideo({ ...video, notes: '', savedAt: Date.now() }));
    setRipple((n) => n + 1);
    warmGround();
  }, [dispatch, isSaved, video]);

  const watch = () => {
    setSeenBefore(watched.includes(video.id));
    if (!watched.includes(video.id)) setWatched([...watched, video.id]);
    setStage('watch');
  };

  const closePlayer = useCallback(() => setStage((s) => (s === 'watch' ? 'line' : s)), []);
  const endPlayer = useCallback(() => {
    dispatch(logPractice({ kind: 'watch', at: Date.now(), id: video.id }));
    setStage('after');
  }, [dispatch, video]);

  if (allLoved) {
    return (
      <PageTransition>
        <Scene>
          <Done>
            <Eyebrow>Every line, kept</Eyebrow>
            <h2>You have loved the whole library.</h2>
            <p>Tend what stayed with you. New shorts arrive as the library grows.</p>
            <Button as={Link} to="/garden">Open the Garden</Button>
          </Done>
        </Scene>
      </PageTransition>
    );
  }

  const label = stage === 'after' ? 'Sit with it' : isWandering ? 'Wandering' : "Today's sage";
  const detail = [video.thinker ? video.title : null, video.creatorChannel].filter(Boolean).join(' · ');

  return (
    <PageTransition>
      <Scene>
        <TopRow>
          <Eyebrow>
            {weekday()} · {label}
          </Eyebrow>
          <SproutMark aria-hidden>
            <Sprout />
          </SproutMark>
        </TopRow>

        <Headline>
          {greeting()} <span>what do you need?</span>
        </Headline>

        <Intents role="group" aria-label="What do you need today?">
          {INTENTS.map(({ id, label: text, blurb }) => (
            <Chip key={id} $active={intent === id && !isWandering} aria-pressed={intent === id && !isWandering} onClick={() => choose(id)} title={blurb}>
              {text}
            </Chip>
          ))}
        </Intents>

        <Below>
          <TextButton onClick={() => choose(null)}>
            <Shuffle aria-hidden /> Surprise me
          </TextButton>
          {isWandering && (
            <TextButton onClick={backToToday}>
              <Undo2 aria-hidden /> Back to today's line
            </TextButton>
          )}
        </Below>

        <Card aria-label="Today's line" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
          <AnimatePresence mode="wait" initial={false}>
            <CardBody
              key={video.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.22 } }}
              transition={{ duration: 0.3 }}
            >
              <Line initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: WORD_STAGGER, delayChildren: WORD_DELAY } } }}>
                {words.map((w, i) => (
                  <Word key={`${w}-${i}`} variants={wordVariants}>
                    {w}
                    {i < words.length - 1 ? ' ' : ''}
                  </Word>
                ))}
              </Line>

              <Meta initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: settleAt }}>
                {video.thinker ? (
                  <Link className="who" to={`/thinkers/${thinkerSlug(video.thinker)}`}>
                    {video.thinker}
                  </Link>
                ) : (
                  <span className="who">{video.title}</span>
                )}
                {detail && <span className="what">{detail}</span>}
              </Meta>

              {stage === 'after' && video.prompt && (
                <Prompt initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={springSoft}>
                  <small>Sit with it</small>
                  <p>{video.prompt}</p>
                </Prompt>
              )}
            </CardBody>
          </AnimatePresence>

          <Actions initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.3 }}>
            <MintButton onClick={watch} whileTap={{ scale: 0.97 }}>
              {stage === 'after' ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
              {stage === 'after' ? 'Again' : 'Watch'}
            </MintButton>
            <HeartWrap>
              <AnimatePresence>
                {ripple > 0 && (
                  <Ripple
                    key={ripple}
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.9, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>
              <HeartButton
                $size={44}
                $tone={isSaved ? 'ember' : 'onForest'}
                $loved={isSaved}
                onClick={love}
                aria-label={isSaved ? 'Remove from your garden' : 'Keep this line'}
                aria-pressed={isSaved}
                whileTap={{ scale: 0.88 }}
              >
                <Heart fill={isSaved ? 'currentColor' : 'none'} aria-hidden />
              </HeartButton>
            </HeartWrap>
            <IconButton $size={44} $tone="onForest" onClick={() => setSharing(video)} aria-label="Share as a card" whileTap={{ scale: 0.9 }}>
              <Share2 aria-hidden />
            </IconButton>
            <OnForestText onClick={wander}>Another</OnForestText>
          </Actions>
        </Card>

        {continuing && (
          <PathCard to={`/paths/${continuing.path.id}`}>
            <span className="tile" aria-hidden>
              <Sprout />
            </span>
            <span className="text">
              <strong>{continuing.path.title}</strong>
              <small>
                {continuing.progress.done.length} of {continuing.path.steps.length} walked · continue your path
              </small>
            </span>
            <ChevronRight aria-hidden />
          </PathCard>
        )}

        <Footer>
          {practiceDays > 0 && (
            <span>
              {practiceDays} {practiceDays === 1 ? 'day' : 'days'} of practice
            </span>
          )}
          {practiceDays > 0 && saved.length > 0 && <span aria-hidden>·</span>}
          {saved.length > 0 && (
            <span>
              {saved.length} {saved.length === 1 ? 'line' : 'lines'} kept
            </span>
          )}
          {practiceDays === 0 && saved.length === 0 && <span>Watch one short to the end and the day counts</span>}
          {(practiceDays > 0 || saved.length > 0) && (
            <>
              <span aria-hidden>·</span>
              <Link to="/week">Your week</Link>
            </>
          )}
        </Footer>

        <WisdomCardModal video={sharing} onClose={() => setSharing(null)} />

        <AnimatePresence>
          {stage === 'watch' && (
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

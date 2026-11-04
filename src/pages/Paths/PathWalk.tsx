import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Play, RotateCcw } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import { Eyebrow, Button, GhostButton, MintButton, TextButton, Surface, ForestCard } from '../../components/ui';
import { pathById, videoForStep } from '../../data/paths';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { completeStep, resetPath } from '../../store/pathsSlice';
import { logPractice } from '../../store/ritualSlice';
import { spring, springSoft } from '../../styles/motion';

const Container = styled.div`
  max-width: 680px;
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

const Head = styled.header`
  display: grid;
  gap: 0.6rem;

  h1 {
    font-size: clamp(2rem, 6vw, 2.6rem);
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 58ch;
  }
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.ink3};

  i {
    flex: 1;
    max-width: 220px;
    height: 6px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.surface2};
    position: relative;
    overflow: hidden;
  }

  i::after {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--p);
    background: ${({ theme }) => theme.colors.ember};
    background-image: linear-gradient(90deg, var(--ember), var(--hue-apricot));
    transition: width 0.6s var(--ease-out);
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: grid;
  gap: 0.75rem;
`;

const Step = styled(motion.li)<{ $state: 'done' | 'next' | 'later' }>`
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr);
  gap: 1rem;
  padding: 1.1rem 1.2rem;
  border-radius: var(--radius-l);
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ $state, theme }) => ($state === 'later' ? 'none' : theme.shadows.card)};
`;

const Num = styled.div<{ $state: 'done' | 'next' | 'later' }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ $state, theme }) => ($state === 'done' ? theme.colors.onAction : $state === 'next' ? theme.colors.onMint : theme.colors.ink2)};
  background: ${({ $state, theme }) => ($state === 'done' ? theme.colors.action : $state === 'next' ? theme.colors.mint : theme.colors.surface2)};

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.4;
  }
`;

const Body = styled.div`
  min-width: 0;
  display: grid;
  gap: 0.5rem;

  > * {
    min-width: 0;
  }
`;

const Title = styled.div`
  display: grid;
  gap: 0.1rem;

  strong {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  small {
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.ink3};
  }
`;

/* The wisdom line: the one place Fraunces appears. */
const Wisdom = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-style: italic;
  font-weight: 300;
  font-variation-settings: 'opsz' 72, 'SOFT' 100;
  font-size: 1.15rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.ink};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

const Reflection = styled.div`
  font-size: 0.92rem;
  color: ${({ theme }) => theme.colors.ink2};
  padding: 0.75rem 0.95rem;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: var(--radius-s);
  white-space: pre-wrap;

  small {
    display: block;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.emberInk};
    margin-bottom: 0.2rem;
  }
`;

/* The question after each short lives on the forest surface, like Today's line. */
const Ask = styled(ForestCard)`
  display: grid;
  gap: 0.85rem;
  margin-top: 0.4rem;
  padding: 1.25rem;

  small {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.emberOnForest};
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.35;
    color: ${({ theme }) => theme.colors.onForest};
  }

  textarea {
    width: 100%;
    min-height: 96px;
    padding: 0.8rem 0.9rem;
    border: none;
    border-radius: var(--radius-s);
    background: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 9%, transparent);
    color: ${({ theme }) => theme.colors.onForest};
    line-height: 1.55;
    resize: vertical;
  }

  textarea::placeholder {
    color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 70%, transparent);
  }

  textarea:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.mint};
    outline-offset: 2px;
  }

  button {
    white-space: normal;
    text-align: left;
  }
`;

const AskText = styled(TextButton)`
  color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 82%, transparent);

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.onForest};
  }
`;

const Closing = styled(motion(Surface))`
  display: grid;
  gap: 0.75rem;
  padding: 1.75rem;
  text-align: center;
  justify-items: center;

  h2 {
    font-size: 1.45rem;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 44ch;
  }
`;

const PathWalk = () => {
  const { pathId = '' } = useParams();
  const path = pathById(pathId);
  const dispatch = useAppDispatch();
  const progress = useAppSelector((s) => s.paths.progress[pathId]);

  const done = useMemo(() => progress?.done ?? [], [progress]);
  const nextIndex = path ? path.steps.findIndex((_, i) => !done.includes(i)) : -1;
  const finished = path ? done.length >= path.steps.length : false;

  const [openStep, setOpenStep] = useState<number | null>(null);
  const [watching, setWatching] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (openStep !== null) setDraft(progress?.reflections[openStep] ?? '');
  }, [openStep, progress]);

  const closePlayer = useCallback(() => setWatching(null), []);
  const endPlayer = useCallback(() => {
    const id = watching !== null ? path?.steps[watching]?.videoId : undefined;
    if (id) dispatch(logPractice({ kind: 'watch', at: Date.now(), id }));
    setOpenStep(watching);
    setWatching(null);
  }, [dispatch, watching, path]);

  if (!path) return <Navigate to="/paths" replace />;

  const save = (step: number) => {
    dispatch(completeStep({ pathId: path.id, step, reflection: draft, totalSteps: path.steps.length }));
    setOpenStep(null);
  };

  const watchingVideo = watching !== null ? videoForStep(path.steps[watching]) : undefined;

  return (
    <PageTransition>
      <Container>
        <Back to="/paths">
          <ArrowLeft /> All paths
        </Back>

        <Head>
          <Eyebrow>{path.eyebrow}</Eyebrow>
          <h1>{path.title}</h1>
          <p>{path.intro}</p>
          <Progress>
            <i style={{ ['--p' as string]: `${(done.length / path.steps.length) * 100}%` }} aria-hidden />
            <span>
              {done.length} of {path.steps.length} walked
            </span>
          </Progress>
        </Head>

        <AnimatePresence>
          {finished && (
            <Closing key="closing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
              <Eyebrow>Walked</Eyebrow>
              <h2>You walked the whole path.</h2>
              <p>{path.closing}</p>
              <GhostButton onClick={() => dispatch(resetPath(path.id))} whileTap={{ scale: 0.97 }}>
                <RotateCcw /> Walk it again
              </GhostButton>
            </Closing>
          )}
        </AnimatePresence>

        <Steps>
          {path.steps.map((step, i) => {
            const video = videoForStep(step);
            const isDone = done.includes(i);
            const state = isDone ? 'done' : i === nextIndex ? 'next' : 'later';
            const reflection = progress?.reflections[i];
            return (
              <Step key={step.videoId} $state={state} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: i * 0.04 }}>
                <Num $state={state} aria-label={isDone ? `Step ${i + 1}, walked` : `Step ${i + 1}`}>
                  {isDone ? <Check /> : i + 1}
                </Num>
                <Body>
                  <Title>
                    <strong>{video?.title ?? 'Missing short'}</strong>
                    <small>
                      {[video?.thinker, video?.creatorChannel && `via ${video.creatorChannel}`].filter(Boolean).join(' · ')}
                    </small>
                  </Title>
                  {video && (state !== 'later' || isDone) && <Wisdom>{video.wisdom}</Wisdom>}

                  {openStep === i ? (
                    <Ask aria-label="Sit with it" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
                      <small>Sit with it</small>
                      <h3>{step.question}</h3>
                      <textarea
                        id={`reflection-${path.id}-${i}`}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="A line or two, if you want. It stays on this device."
                        aria-label={step.question}
                        autoFocus
                      />
                      <Actions>
                        <MintButton onClick={() => save(i)} whileTap={{ scale: 0.97 }}>
                          <Check aria-hidden /> {isDone ? 'Save' : 'Mark this step walked'}
                        </MintButton>
                        <AskText onClick={() => setOpenStep(null)}>Not now</AskText>
                      </Actions>
                    </Ask>
                  ) : (
                    <>
                      {isDone && (
                        <Reflection>
                          <small>{step.question}</small>
                          {reflection ?? <span style={{ fontStyle: 'italic' }}>No note yet.</span>}
                        </Reflection>
                      )}
                      <Actions>
                        {video && (
                          <>
                            {state === 'next' || isDone ? (
                              <Button onClick={() => setWatching(i)} whileTap={{ scale: 0.97 }}>
                                <Play /> {isDone ? 'Watch again' : 'Watch the short'}
                              </Button>
                            ) : (
                              <GhostButton onClick={() => setWatching(i)} whileTap={{ scale: 0.97 }}>
                                <Play /> Watch
                              </GhostButton>
                            )}
                          </>
                        )}
                        {isDone ? (
                          <TextButton onClick={() => setOpenStep(i)}>{reflection ? 'Edit note' : 'Add a note'}</TextButton>
                        ) : (
                          state === 'next' && <TextButton onClick={() => setOpenStep(i)}>Already watched it</TextButton>
                        )}
                      </Actions>
                    </>
                  )}
                </Body>
              </Step>
            );
          })}
        </Steps>

        <AnimatePresence>
          {watchingVideo && <PlayerSheet key={watchingVideo.id} video={watchingVideo} onClose={closePlayer} onEnded={endPlayer} />}
        </AnimatePresence>
      </Container>
    </PageTransition>
  );
};

export default PathWalk;

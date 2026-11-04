import React, { Suspense, lazy, useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, SkipForward, AlertCircle, ExternalLink } from 'lucide-react';
import { Video } from '../../data/videos';
import { IconButton, TextButton } from '../ui';
import { spring, fade } from '../../styles/motion';

const ReactPlayerWrapper = lazy(() => import('./ReactPlayerWrapper'));

const Scrim = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: ${({ theme }) => theme.colors.scrim};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-items: center;
    padding: 2rem;
  }
`;

/* A sheet on the surface: rounded top corners on phones, a rounded card on larger screens. */
const Sheet = styled(motion.div)`
  width: min(100%, 480px);
  max-height: 100dvh;
  overflow-y: auto;
  display: grid;
  gap: 1rem;
  padding: 0.6rem max(1rem, env(safe-area-inset-right, 0px)) calc(1.1rem + env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px));
  background: ${({ theme }) => theme.colors.surface};
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: ${({ theme }) => theme.shadows.float};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    border-radius: var(--radius-xl);
    padding: 1.25rem;
  }
`;

const Grip = styled.span`
  justify-self: center;
  width: 40px;
  height: 5px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface2};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Head = styled.div`
  min-width: 0;
  display: grid;
  gap: 0.1rem;

  h2 {
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.3;
  }

  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.ink2};
  }
`;

/*
 * The player frame is the YouTube player's own box. Nothing of ours sits on it once the video is
 * ready (YouTube API policy III.F.2 / III.I.6): controls and credit live below.
 */
const Frame = styled.div`
  position: relative;
  height: min(60dvh, 600px);
  max-width: 100%;
  aspect-ratio: 9 / 16;
  justify-self: center;
  border-radius: var(--radius-l);
  overflow: hidden;
  background: #000;
`;

const Waiting = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surface2};
  color: ${({ theme }) => theme.colors.ink2};
  font-size: 0.9rem;

  svg {
    width: 28px;
    height: 28px;
    stroke-width: 1.7;
    color: ${({ theme }) => theme.colors.emberInk};
  }
`;

const Pulse = styled(motion.div)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--ember) 55%, transparent), transparent 70%);
`;

const Credit = styled.a`
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.84rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink2};

  strong {
    font-weight: 650;
    color: ${({ theme }) => theme.colors.ink};
  }

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover strong {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

interface PlayerSheetProps {
  video: Video;
  onClose: () => void;
  onEnded?: () => void;
  onNext?: () => void;
  onLove?: () => void;
  isSaved?: boolean;
  seenBefore?: boolean;
}

type Status = 'loading' | 'ready' | 'error';

const PlayerSheet: React.FC<PlayerSheetProps> = ({ video, onClose, onEnded, onNext, onLove, isSaved, seenBefore }) => {
  const [status, setStatus] = useState<Status>('loading');
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setStatus('loading');
  }, [video.id]);

  // Modal behaviour: Escape closes, the page behind stops scrolling, focus moves in and comes back.
  // The open flag lets the living ground pause while a video plays.
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.dataset.player = 'open';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      delete document.documentElement.dataset.player;
      returnTo?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    if (status !== 'error') return;
    const t = window.setTimeout(() => (onNext ? onNext() : onClose()), 2600);
    return () => window.clearTimeout(t);
  }, [status, onNext, onClose]);

  const speaker = video.thinker;

  return (
    <Scrim
      variants={fade}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Sheet
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={spring}
      >
        <Grip aria-hidden />
        <Head>
          <h2 id={titleId}>{video.title}</h2>
          {speaker && <span>{speaker}</span>}
        </Head>

        <Frame>
          {status !== 'error' && (
            <Suspense fallback={null}>
              <ReactPlayerWrapper
                videoId={video.id}
                onReady={() => setStatus('ready')}
                onError={() => setStatus('error')}
                onEnded={() => onEnded?.()}
              />
            </Suspense>
          )}
          <AnimatePresence>
            {status === 'loading' && (
              <Waiting key="loading" variants={fade} initial="initial" animate="animate" exit="exit">
                <Pulse animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
                <span>Finding the words…</span>
              </Waiting>
            )}
            {status === 'error' && (
              <Waiting key="error" variants={fade} initial="initial" animate="animate" exit="exit">
                <AlertCircle aria-hidden />
                <span>This one would not play. Moving on.</span>
              </Waiting>
            )}
          </AnimatePresence>
        </Frame>

        <Credit href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
          {video.creatorChannel ? (
            <>
              From <strong>{video.creatorChannel}</strong> on YouTube
            </>
          ) : (
            <>Watch on YouTube</>
          )}
          <ExternalLink aria-hidden />
        </Credit>

        <Controls>
          {onLove && (
            <IconButton
              $tone={isSaved ? 'ember' : 'surface'}
              $size={52}
              onClick={onLove}
              aria-label={isSaved ? 'Remove from your garden' : 'Keep this line'}
              aria-pressed={isSaved}
              whileTap={{ scale: 0.9 }}
              style={isSaved ? undefined : { color: 'var(--ember-ink)' }}
            >
              <Heart fill={isSaved ? 'currentColor' : 'none'} aria-hidden />
            </IconButton>
          )}
          {onNext && (
            <IconButton $tone="surface" $size={52} onClick={onNext} aria-label="Next short" whileTap={{ scale: 0.9 }}>
              <SkipForward aria-hidden />
            </IconButton>
          )}
          <IconButton ref={closeRef} $tone="forest" $size={52} onClick={onClose} aria-label="Close player" whileTap={{ scale: 0.9 }}>
            <X aria-hidden />
          </IconButton>
        </Controls>

        {seenBefore && onNext && (
          <TextButton onClick={onNext} style={{ justifySelf: 'center' }}>
            You have seen this one · skip
          </TextButton>
        )}
      </Sheet>
    </Scrim>
  );
};

export default PlayerSheet;

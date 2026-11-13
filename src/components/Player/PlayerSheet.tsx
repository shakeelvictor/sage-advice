import React, { Suspense, lazy, useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, SkipForward, AlertCircle, ExternalLink } from 'lucide-react';
import { Video } from '../../data/videos';
import { spring, fade } from '../../styles/motion';

const ReactPlayerWrapper = lazy(() => import('./ReactPlayerWrapper'));

const TOP_BAR = '60px';

/*
 * A full-screen stage, always dark like a cinema, whatever the app theme. The video fills it edge to
 * edge on phones; on wider screens it sits centred on a soft blur of its own thumbnail.
 */
const Stage = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  overflow: hidden;
  background: #000;
  color: #fff;
`;

const Backdrop = styled.img`
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  object-fit: cover;
  filter: blur(48px) saturate(1.2);
  opacity: 0.45;
  pointer-events: none;
`;

/*
 * The top bar owns its own strip. The frame below is sized so the bar never sits on the video,
 * because YouTube's channel avatar, title and sound controls live along the player's top edge.
 */
const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: calc(${TOP_BAR} + env(safe-area-inset-top, 0px));
  padding: env(safe-area-inset-top, 0px) max(0.75rem, env(safe-area-inset-right, 0px)) 0 max(0.75rem, env(safe-area-inset-left, 0px));
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0));
`;

const Title = styled.div`
  min-width: 0;
  flex: 1;
  display: grid;
  line-height: 1.25;

  h2 {
    font-size: 0.98rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    justify-self: start;
    max-width: 100%;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.72);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a:hover {
    color: #fff;
  }

  svg {
    flex: none;
    width: 12px;
    height: 12px;
  }
`;

const Skip = styled.button`
  flex: none;
  min-height: 32px;
  padding: 0 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.24);
  }
`;

const Area = styled.div`
  position: absolute;
  inset: calc(${TOP_BAR} + env(safe-area-inset-top, 0px)) 0 env(safe-area-inset-bottom, 0px);
  display: grid;
  /* Phones: the video meets the top bar, so any spare height gathers by the home indicator. */
  place-items: start center;

  @media (min-aspect-ratio: 3/4) {
    place-items: center;
  }
`;

/* The YouTube player's own box: as large as the screen allows at 9:16. The rail anchors to it. */
const Frame = styled.div`
  position: relative;
  height: min(100%, calc(100vw * 16 / 9));
  aspect-ratio: 9 / 16;
  max-width: 100vw;
`;

/* Rounds and clips the video on wider screens without clipping the rail beside it. */
const Clip = styled.div`
  position: absolute;
  inset: 0;
  background: #000;

  @media (min-aspect-ratio: 3/4) {
    border-radius: var(--radius-l);
    overflow: hidden;
    box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8);
  }
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
  background: #0b0b0b;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.9rem;

  svg {
    width: 28px;
    height: 28px;
    stroke-width: 1.7;
    color: var(--ember);
  }
`;

const Pulse = styled(motion.div)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--ember) 55%, transparent), transparent 70%);
`;

/*
 * The rail, TikTok style. On phones it floats over the right edge at mid height, the one strip of
 * the YouTube Shorts player that carries none of its own controls. Wherever the screen leaves room
 * beside the video, it moves out of the frame entirely.
 */
const Rail = styled(motion.div)`
  position: absolute;
  z-index: 3;
  right: max(0.6rem, env(safe-area-inset-right, 0px));
  top: 50%;
  display: grid;
  gap: 1.1rem;
  justify-items: center;
  opacity: 0.82;
  transition: opacity 0.25s ease;

  &:hover,
  &:focus-within {
    opacity: 1;
  }

  @media (min-aspect-ratio: 3/4) {
    right: auto;
    left: calc(100% + 1.25rem);
    opacity: 1;
  }
`;

const RailButton = styled(motion.button)<{ $on?: boolean }>`
  display: grid;
  justify-items: center;
  gap: 0.3rem;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);

  span:first-child {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${({ $on }) => ($on ? 'var(--ember)' : 'rgba(0, 0, 0, 0.38)')};
    color: ${({ $on }) => ($on ? 'var(--ember-ink, #1c1a17)' : '#fff')};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;
  }

  &:hover span:first-child {
    background: ${({ $on }) => ($on ? 'var(--ember)' : 'rgba(0, 0, 0, 0.58)')};
    transform: scale(1.06);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible span:first-child {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;

const CloseButton = styled(motion.button)`
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 2;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.24);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
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

  // Modal behaviour: Escape closes, arrow down moves on, the page behind stops scrolling, focus
  // moves in and comes back. The open flag lets the living ground pause while a video plays.
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && onNext) {
        e.preventDefault();
        onNext();
      }
    };
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
  }, [onClose, onNext]);

  useEffect(() => {
    if (status !== 'error') return;
    const t = window.setTimeout(() => (onNext ? onNext() : onClose()), 2600);
    return () => window.clearTimeout(t);
  }, [status, onNext, onClose]);

  const credit = [video.thinker, video.creatorChannel ? `${video.creatorChannel} on YouTube` : 'Watch on YouTube'].filter(Boolean).join(' · ');

  return (
    <Stage role="dialog" aria-modal="true" aria-labelledby={titleId} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}>
      <Backdrop src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" aria-hidden />

      <TopBar>
        <CloseButton ref={closeRef} onClick={onClose} aria-label="Close player" whileTap={{ scale: 0.9 }}>
          <X aria-hidden />
        </CloseButton>
        <Title>
          <h2 id={titleId}>{video.title}</h2>
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
            {credit}
            <ExternalLink aria-hidden />
          </a>
        </Title>
        {seenBefore && onNext && <Skip onClick={onNext}>Seen it · skip</Skip>}
      </TopBar>

      <Area>
        <Frame>
          <Clip>
            {status !== 'error' && (
              <Suspense fallback={null}>
                <ReactPlayerWrapper
                  key={video.id}
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
                  <Pulse
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
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
          </Clip>

          {(onLove || onNext) && (
            <Rail style={{ y: '-50%' }} initial={{ x: 16 }} animate={{ x: 0 }} transition={{ ...spring, delay: 0.25 }}>
              {onLove && (
                <RailButton
                  $on={isSaved}
                  onClick={onLove}
                  aria-label={isSaved ? 'Remove from your garden' : 'Keep this line'}
                  aria-pressed={isSaved}
                  whileTap={{ scale: 0.88 }}
                >
                  <span>
                    <Heart fill={isSaved ? 'currentColor' : 'none'} aria-hidden />
                  </span>
                  <span aria-hidden>{isSaved ? 'Kept' : 'Keep'}</span>
                </RailButton>
              )}
              {onNext && (
                <RailButton onClick={onNext} aria-label="Next short" whileTap={{ scale: 0.88 }}>
                  <span>
                    <SkipForward aria-hidden />
                  </span>
                  <span aria-hidden>Next</span>
                </RailButton>
              )}
            </Rail>
          )}
        </Frame>
      </Area>
    </Stage>
  );
};

export default PlayerSheet;

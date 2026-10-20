import React, { Suspense, lazy, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, SkipForward, AlertCircle } from 'lucide-react';
import { Video } from '../../data/videos';
import { IconButton, TextButton } from '../ui';
import { spring, fade } from '../../styles/motion';

const ReactPlayerWrapper = lazy(() => import('./ReactPlayerWrapper'));

const Sheet = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: calc(1rem + env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px)) calc(1rem + env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px));
  background: ${({ theme }) => theme.colors.scrim};
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

const Panel = styled(motion.div)`
  width: min(100%, 440px);
  display: grid;
  gap: 0.9rem;
`;

const Head = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.ink};
`;

const Title = styled.div`
  min-width: 0;
  display: grid;
  gap: 0.15rem;

  strong {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.3;
  }

  span {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.ink2};
  }
`;

/* The player frame is sacred: nothing of ours sits on top of it once the video is ready. */
const Frame = styled.div`
  position: relative;
  height: min(68vh, 640px);
  max-width: 100%;
  aspect-ratio: 9 / 16;
  margin: 0 auto;
  border-radius: var(--radius-l);
  overflow: hidden;
  background: #000;
  border: 1px solid ${({ theme }) => theme.colors.line};
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.7);
`;

const Overlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 0.75rem;
  text-align: center;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink2};
  font-size: 0.9rem;

  svg {
    width: 28px;
    height: 28px;
    stroke-width: 1.6;
    color: ${({ theme }) => theme.colors.amber};
  }
`;

const Pulse = styled(motion.div)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow), transparent 70%);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.9rem;
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

  useEffect(() => {
    setStatus('loading');
  }, [video.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (status !== 'error') return;
    const t = window.setTimeout(() => (onNext ? onNext() : onClose()), 2600);
    return () => window.clearTimeout(t);
  }, [status, onNext, onClose]);

  const attribution = [video.thinker, video.creatorChannel && `via ${video.creatorChannel}`].filter(Boolean).join(' · ');

  return (
    <Sheet variants={fade} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.35 }}>
      <Panel initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={spring}>
        <Head>
          <Title>
            <strong>{video.title}</strong>
            {attribution && <span>{attribution}</span>}
          </Title>
          <IconButton $size={40} onClick={onClose} aria-label="Close" whileTap={{ scale: 0.92 }}>
            <X />
          </IconButton>
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
              <Overlay key="loading" variants={fade} initial="initial" animate="animate" exit="exit">
                <Pulse animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
                <span>Finding the words…</span>
              </Overlay>
            )}
            {status === 'error' && (
              <Overlay key="error" variants={fade} initial="initial" animate="animate" exit="exit">
                <AlertCircle />
                <span>This one would not play. Moving on.</span>
              </Overlay>
            )}
          </AnimatePresence>
        </Frame>

        <Controls>
          {onLove && (
            <IconButton
              $tone={isSaved ? 'amber' : 'ghost'}
              $size={52}
              onClick={onLove}
              aria-label={isSaved ? 'Remove from loved' : 'Love this'}
              aria-pressed={isSaved}
              whileTap={{ scale: 0.9 }}
            >
              <Heart fill={isSaved ? 'currentColor' : 'none'} />
            </IconButton>
          )}
          {onNext && (
            <IconButton $size={52} onClick={onNext} aria-label="Next" whileTap={{ scale: 0.9 }}>
              <SkipForward />
            </IconButton>
          )}
        </Controls>
        {seenBefore && onNext && (
          <TextButton onClick={onNext} style={{ justifySelf: 'center' }}>
            You have seen this one · skip
          </TextButton>
        )}
      </Panel>
    </Sheet>
  );
};

export default PlayerSheet;

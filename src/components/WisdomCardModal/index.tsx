import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, X } from 'lucide-react';
import { Video } from '../../data/videos';
import { Button, GhostButton, IconButton, Chip, Eyebrow } from '../ui';
import { spring, fade } from '../../styles/motion';
import { CardTheme, canShareFiles, cardFileName, downloadBlob, renderWisdomCard } from '../../utils/wisdomCard';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: calc(1rem + env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px)) calc(1rem + env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px));
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.scrim};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
`;

const Panel = styled(motion.div)`
  width: min(100%, 460px);
  display: grid;
  gap: 1rem;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.ink};

  h2 {
    font-size: 1.3rem;
  }
`;

const Preview = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-l);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.line};
  box-shadow: 0 40px 80px -40px rgba(0, 0, 0, 0.7);
  max-height: 62vh;
  margin: 0 auto;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Loading = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.ink3};
  font-size: 0.9rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Variants = styled.div`
  display: flex;
  gap: 0.4rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const Note = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.ink3};
  text-align: center;
`;

interface WisdomCardModalProps {
  video: Video | null;
  onClose: () => void;
}

/** Preview of a line as an image, with the native share sheet when it can take files and a download otherwise. */
const WisdomCardModal: React.FC<WisdomCardModalProps> = ({ video, onClose }) => {
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'shared' | 'saved' | 'failed'>('idle');

  useEffect(() => {
    if (!video) return;
    let cancelled = false;
    setBlob(null);
    setStatus('idle');
    renderWisdomCard(video, theme)
      .then((b) => {
        if (cancelled) return;
        setBlob(b);
        setUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(b);
        });
      })
      .catch(() => !cancelled && setStatus('failed'));
    return () => {
      cancelled = true;
    };
  }, [video, theme]);

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);

  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [video, onClose]);

  const file = video && blob ? new File([blob], cardFileName(video), { type: 'image/png' }) : null;
  const shareable = file ? canShareFiles(file) : false;

  const share = async () => {
    if (!video || !file) return;
    try {
      await navigator.share({ files: [file], title: video.title, text: `“${video.wisdom}” — ${video.thinker ?? video.title}` });
      setStatus('shared');
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') setStatus('failed');
    }
  };

  const save = () => {
    if (!video || !blob) return;
    downloadBlob(blob, cardFileName(video));
    setStatus('saved');
  };

  return (
    <AnimatePresence>
      {video && (
        <Overlay variants={fade} initial="initial" animate="animate" exit="exit" onClick={onClose}>
          <Panel
            role="dialog"
            aria-modal="true"
            aria-labelledby="wisdom-card-title"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={spring}
            onClick={(e) => e.stopPropagation()}
          >
            <Head>
              <div>
                <Eyebrow>Wisdom card</Eyebrow>
                <h2 id="wisdom-card-title">Pass it on</h2>
              </div>
              <IconButton $size={40} onClick={onClose} aria-label="Close" whileTap={{ scale: 0.92 }}>
                <X />
              </IconButton>
            </Head>

            <Preview>
              {url ? <img src={url} alt={`“${video.wisdom}” as a card`} /> : <Loading>{status === 'failed' ? 'The card could not be drawn.' : 'Drawing the card…'}</Loading>}
            </Preview>

            <Row>
              <Variants role="group" aria-label="Card style">
                <Chip $active={theme === 'dark'} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>Dusk</Chip>
                <Chip $active={theme === 'light'} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>Morning</Chip>
              </Variants>
              <Actions>
                {shareable ? (
                  <>
                    <GhostButton onClick={save} disabled={!blob} whileTap={{ scale: 0.97 }} aria-label="Save image">
                      <Download />
                    </GhostButton>
                    <Button onClick={share} disabled={!blob} whileTap={{ scale: 0.97 }}>
                      <Share2 /> Share
                    </Button>
                  </>
                ) : (
                  <Button onClick={save} disabled={!blob} whileTap={{ scale: 0.97 }}>
                    <Download /> Save image
                  </Button>
                )}
              </Actions>
            </Row>
            <Note>
              {status === 'shared' ? 'Shared.' : status === 'saved' ? 'Saved to your downloads.' : status === 'failed' ? 'That did not work. Try saving the image instead.' : '1080 × 1350, made for a story or a message.'}
            </Note>
          </Panel>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default WisdomCardModal;

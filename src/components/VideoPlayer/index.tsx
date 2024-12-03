import React, { useState, useCallback, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BsPlayFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { BiRefresh } from 'react-icons/bi';
import { videos, Video } from '../../data/videos';
import { getRandomVideo } from '../../utils/videoUtils';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addVideo, removeVideo } from '../../store/lovedVideosSlice';
import { useVideoPlayback } from '../../hooks/useVideoPlayback';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import SkipButton from '../SkipButton';
import LoadingState from './LoadingState';
import ReactPlayerWrapper from './ReactPlayerWrapper';

const Container = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PlayerWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CloseButton = styled(motion.button)`
  position: fixed;
  top: 2.5rem;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  z-index: 100;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const WisdomText = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-size: cover;
  background-position: center;
  text-align: center;
  color: white;
`;

const Text = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-family: ${({ theme }) => theme.fonts.secondary};
  max-width: 800px;
  position: relative;
  z-index: 1;
`;

const Controls = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const ControlButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const LoveButton = styled(ControlButton)<{ $isLoved?: boolean }>`
  background: ${({ $isLoved, theme }) =>
    $isLoved ? '#dc3545' : theme.colors.primary};
`;

const MessageContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 400px;

  h2 {
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 0;
`;

const ErrorMessage = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 400px;
  z-index: 20;

  h3 {
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }
`;

export interface SavedVideo extends Video {
  notes: string;
  savedAt: number;
}

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const savedVideos = useAppSelector(state => state.lovedVideos.videos);
  const [showText, setShowText] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(() =>
    getRandomVideo(undefined, true, savedVideos.map(v => v.id))
  );
  const [watchedVideos, setWatchedVideos] = useSessionStorage<string[]>('watchedVideos', []);

  const handleVideoSkip = useCallback((nextVideo: Video) => {
    setCurrentVideo(nextVideo);
    setShowText(false);
  }, []);

  const {
    isVideoError,
    isLoading,
    loadAttempts,
    maxAttempts,
    handleVideoError,
    handleVideoReady,
    handleVideoEnd
  } = useVideoPlayback(() => setShowText(true), handleVideoSkip);

  const isVideoSaved = currentVideo ? savedVideos.some(v => v.id === currentVideo.id) : false;
  const allVideosLoved = savedVideos.length === videos.length;
  const hasWatchedBefore = currentVideo ? watchedVideos.includes(currentVideo.id) : false;
  const maxAttemptsReached = loadAttempts >= maxAttempts;

  const handleNext = useCallback(() => {
    const nextVideo = getRandomVideo(currentVideo?.id, true, savedVideos.map(v => v.id));
    setCurrentVideo(nextVideo);
    setShowText(false);
  }, [currentVideo?.id, savedVideos]);

  const handleReplay = useCallback(() => {
    setShowText(false);
  }, []);

  const handleSaveVideo = useCallback(() => {
    if (!currentVideo) return;

    if (isVideoSaved) {
      dispatch(removeVideo(currentVideo.id));
    } else {
      dispatch(addVideo({
        ...currentVideo,
        notes: '',
        savedAt: Date.now()
      }));
      handleNext();
    }
  }, [currentVideo, isVideoSaved, dispatch, handleNext]);

  useEffect(() => {
    if (currentVideo && !watchedVideos.includes(currentVideo.id)) {
      setWatchedVideos([...watchedVideos, currentVideo.id]);
    }
  }, [currentVideo, watchedVideos, setWatchedVideos]);

  useEffect(() => {
    if (isVideoSaved) {
      handleNext();
    }
  }, [isVideoSaved, handleNext]);

  useEffect(() => {
    if (allVideosLoved) {
      setCurrentVideo(null);
    }
  }, [allVideosLoved]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <Container
        key="video-player-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <CloseButton
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoClose />
        </CloseButton>

        {allVideosLoved ? (
          <MessageContainer
            key="all-loved-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>All Videos Loved!</h2>
            <p>You've loved all available videos. Visit your Loved section to revisit your favorite wisdom.</p>
            <ControlButton onClick={onClose}>
              <IoClose />
            </ControlButton>
          </MessageContainer>
        ) : currentVideo && !showText ? (
          <PlayerWrapper key="video-player">
            <AnimatePresence mode="wait">
              {hasWatchedBefore && (
                <SkipButton key="skip-button" onSkip={handleNext} />
              )}
              {isLoading && !maxAttemptsReached && (
                <LoadingState key="loading-state" />
              )}
              {(isVideoError || maxAttemptsReached) && (
                <ErrorMessage
                  key="error-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <h3>Unable to Load Video</h3>
                  <p>We're having trouble playing this video. Let's try another one.</p>
                  <ControlButton onClick={handleNext}>
                    <BsPlayFill />
                  </ControlButton>
                </ErrorMessage>
              )}
            </AnimatePresence>
            {!maxAttemptsReached && currentVideo && (
              <Suspense fallback={<LoadingState />}>
                <ReactPlayerWrapper
                  videoId={currentVideo.id}
                  onError={handleVideoError}
                  onReady={handleVideoReady}
                  onEnded={handleVideoEnd}
                />
              </Suspense>
            )}
          </PlayerWrapper>
        ) : currentVideo && showText ? (
          <WisdomText
            key="wisdom-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundImage: `url(${currentVideo.background})`
            }}
          >
            <Overlay />
            <Text>{currentVideo.wisdom}</Text>
            <Controls
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ControlButton
                onClick={handleReplay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BiRefresh />
              </ControlButton>
              <LoveButton
                onClick={handleSaveVideo}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                $isLoved={isVideoSaved}
              >
                <FaHeart />
              </LoveButton>
              <ControlButton
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BsPlayFill />
              </ControlButton>
            </Controls>
          </WisdomText>
        ) : null}
      </Container>
    </AnimatePresence>
  );
};

export default VideoPlayer;
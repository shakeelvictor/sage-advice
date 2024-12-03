import { useState, useCallback, useEffect } from 'react';
import { Video } from '../data/videos';
import { getRandomVideo } from '../utils/videoUtils';

export const useVideoPlayback = (onVideoEnd?: () => void, onVideoSkip?: (nextVideo: Video) => void) => {
  const [isVideoError, setIsVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const maxAttempts = 3;

  const handleVideoError = useCallback(() => {
    setIsVideoError(true);
    setIsLoading(false);

    // Always try to get a new video on error
    const nextVideo = getRandomVideo(currentVideoId || undefined);
    onVideoSkip?.(nextVideo);
    setCurrentVideoId(nextVideo.id);
    setLoadAttempts(prev => prev + 1);
  }, [currentVideoId, onVideoSkip]);

  const handleVideoReady = useCallback(() => {
    setIsLoading(false);
    setIsVideoError(false);
    setLoadAttempts(0); // Reset attempts on successful load
  }, []);

  const handleVideoEnd = useCallback(() => {
    onVideoEnd?.();
  }, [onVideoEnd]);

  // Reset error state when video ID changes
  useEffect(() => {
    if (currentVideoId) {
      setIsVideoError(false);
      setIsLoading(true);
    }
  }, [currentVideoId]);

  // Auto-skip if max attempts reached
  useEffect(() => {
    if (loadAttempts >= maxAttempts) {
      const nextVideo = getRandomVideo(currentVideoId || undefined);
      onVideoSkip?.(nextVideo);
      setCurrentVideoId(nextVideo.id);
      setLoadAttempts(0);
    }
  }, [loadAttempts, currentVideoId, onVideoSkip, maxAttempts]);

  return {
    isVideoError,
    isLoading,
    loadAttempts,
    currentVideoId,
    setCurrentVideoId,
    handleVideoError,
    handleVideoReady,
    handleVideoEnd,
    maxAttempts
  };
};
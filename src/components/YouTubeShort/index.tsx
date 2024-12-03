import React from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 9/16;
  max-width: 350px;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  background: black;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
`;

const StyledIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

interface YouTubeShortProps {
  videoId: string;
  title?: string;
  onEnded?: () => void;
  className?: string;
}

const YouTubeShort: React.FC<YouTubeShortProps> = ({
  videoId,
  title = 'YouTube Short',
  onEnded,
  className,
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1&controls=1`;

  React.useEffect(() => {
    // Listen for messages from the YouTube iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          // Check if the video has ended
          if (data.event === 'onStateChange' && data.info === 0) {
            onEnded?.();
          }
        } catch (error) {
          // Ignore parsing errors from other messages
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onEnded]);

  return (
    <VideoContainer className={className}>
      <StyledIframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </VideoContainer>
  );
};

export default YouTubeShort;
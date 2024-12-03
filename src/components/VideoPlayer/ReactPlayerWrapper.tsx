import React from 'react';
import ReactPlayer from 'react-player';

interface ReactPlayerWrapperProps {
  videoId: string;
  onError: () => void;
  onReady: () => void;
  onEnded: () => void;
}

const ReactPlayerWrapper: React.FC<ReactPlayerWrapperProps> = ({
  videoId,
  onError,
  onReady,
  onEnded
}) => {
  return (
    <ReactPlayer
      url={`https://www.youtube.com/shorts/${videoId}`}
      width="100%"
      height="100%"
      playing
      controls
      onError={onError}
      onReady={onReady}
      onEnded={onEnded}
      fallback={<div>Loading...</div>}
      config={{
        youtube: {
          playerVars: {
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            playsinline: 1,
          }
        }
      }}
    />
  );
};

export default ReactPlayerWrapper;
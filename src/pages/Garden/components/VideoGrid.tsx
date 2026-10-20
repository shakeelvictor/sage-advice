import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { SavedVideo } from '../../../types/video';
import VideoCard from './VideoCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1.25rem;
  align-items: start;
`;

interface VideoGridProps {
  videos: SavedVideo[];
  selectedCategory: string;
  onEdit: (video: SavedVideo) => void;
  onDelete: (video: SavedVideo) => void;
  onPlay: (video: SavedVideo) => void;
  onShare: (video: SavedVideo) => void;
}

const VideoGrid = ({ videos, selectedCategory, onEdit, onDelete, onPlay, onShare }: VideoGridProps) => {
  const filtered =
    selectedCategory === 'all'
      ? videos
      : videos.filter((video) => (video.categories as string[]).includes(selectedCategory));

  return (
    <Grid>
      <AnimatePresence>
        {filtered.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={() => onEdit(video)}
            onDelete={() => onDelete(video)}
            onPlay={() => onPlay(video)}
            onShare={() => onShare(video)}
          />
        ))}
      </AnimatePresence>
    </Grid>
  );
};

export default VideoGrid;

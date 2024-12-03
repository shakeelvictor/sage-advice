import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { SavedVideo } from '../../../components/VideoPlayer';
import VideoCard from './VideoCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

interface VideoGridProps {
  videos: SavedVideo[];
  selectedCategory: string;
  onEdit: (video: SavedVideo) => void;
  onDelete: (video: SavedVideo) => void;
  onPlay: (id: string) => void;
}

const VideoGrid = ({ videos, selectedCategory, onEdit, onDelete, onPlay }: VideoGridProps) => {
  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(video => video.categories.includes(selectedCategory as any));

  return (
    <Grid>
      <AnimatePresence>
        {filteredVideos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={() => onEdit(video)}
            onDelete={() => onDelete(video)}
            onPlay={() => onPlay(video.id)}
          />
        ))}
      </AnimatePresence>
    </Grid>
  );
};

export default VideoGrid;
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { SavedVideo } from '../../../components/VideoPlayer';

const Card = styled(motion.div)<{ $background?: string }>`
  position: relative;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 1rem;
  padding: 1.5rem;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${({ $background }) => $background ? `url(${$background})` : 'none'};
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => 
      theme.colors.text.primary === '#ffffff' 
        ? 'rgba(0, 0, 0, 0.7)' 
        : 'rgba(255, 255, 255, -0.3)'};
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

const CategoryTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 1rem;
  font-size: 0.875rem;
  text-transform: capitalize;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const WisdomText = styled.p`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-style: italic;
  margin: 1rem 0;
  line-height: 1.6;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NotesContent = styled.div`
  margin: 1.5rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.primary}80;
  border-radius: 0.5rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface VideoCardProps {
  video: SavedVideo;
  onEdit: () => void;
  onDelete: () => void;
  onPlay: () => void;
}

const VideoCard = ({ video, onEdit, onDelete, onPlay }: VideoCardProps) => {
  if (!video) return null;

  return (
    <Card
      $background={video.background}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {video.categories && video.categories.length > 0 && (
        <CategoryTags>
          {video.categories.map(category => (
            <CategoryTag key={category}>{category}</CategoryTag>
          ))}
        </CategoryTags>
      )}
      <Title>{video.title}</Title>
      <WisdomText>{video.wisdom}</WisdomText>
      {video.notes && <NotesContent>{video.notes}</NotesContent>}
      <ButtonGroup>
        <IconButton onClick={onPlay}>
          <FaPlay size={16} />
          Play
        </IconButton>
        <IconButton onClick={onEdit}>
          <FaEdit size={16} />
          Edit Notes
        </IconButton>
        <IconButton onClick={onDelete}>
          <FaTrashAlt size={16} />
          Delete
        </IconButton>
      </ButtonGroup>
    </Card>
  );
};

export default VideoCard;
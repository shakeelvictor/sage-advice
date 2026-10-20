import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Pencil, Trash2 } from 'lucide-react';
import { SavedVideo } from '../../../types/video';
import { Surface, Tag, IconButton } from '../../../components/ui';
import { spring } from '../../../styles/motion';

const Card = styled(motion(Surface))`
  display: grid;
  gap: 0.9rem;
  padding: 1.35rem 1.35rem 1.1rem;
  min-width: 0;
`;

const Tags = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const Wisdom = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 300;
  font-variation-settings: 'SOFT' 70;
  font-size: 1.35rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.ink};
  text-wrap: pretty;
`;

const Meta = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.ink2};

  strong {
    color: ${({ theme }) => theme.colors.ink};
    font-weight: 700;
  }
`;

const Note = styled.div`
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.ink2};
  padding: 0.8rem 1rem;
  border-left: 2px solid ${({ theme }) => theme.colors.amber};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.amber} 6%, transparent);
  border-radius: 0 var(--radius-s) var(--radius-s) 0;
  white-space: pre-wrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  > :last-child {
    margin-left: auto;
  }
`;

interface VideoCardProps {
  video: SavedVideo;
  onEdit: () => void;
  onDelete: () => void;
  onPlay: () => void;
}

const VideoCard = ({ video, onEdit, onDelete, onPlay }: VideoCardProps) => (
  <Card layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={spring}>
    {video.categories?.length > 0 && (
      <Tags>
        {video.categories.map((category) => (
          <Tag key={category}>{category}</Tag>
        ))}
      </Tags>
    )}
    <Wisdom>{video.wisdom}</Wisdom>
    <Meta>
      <strong>{video.thinker ?? video.title}</strong>
      {video.thinker && <> · {video.title}</>}
      {video.creatorChannel && <> · via {video.creatorChannel}</>}
    </Meta>
    {video.notes && <Note>{video.notes}</Note>}
    <Actions>
      <IconButton $tone="amber" onClick={onPlay} aria-label={`Watch ${video.title}`} whileTap={{ scale: 0.92 }}>
        <Play />
      </IconButton>
      <IconButton onClick={onEdit} aria-label={video.notes ? 'Edit note' : 'Add a note'} whileTap={{ scale: 0.92 }}>
        <Pencil />
      </IconButton>
      <IconButton $tone="danger" onClick={onDelete} aria-label="Remove from loved" whileTap={{ scale: 0.92 }}>
        <Trash2 />
      </IconButton>
    </Actions>
  </Card>
);

export default VideoCard;

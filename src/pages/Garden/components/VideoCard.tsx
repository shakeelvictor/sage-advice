import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Pencil, Trash2, Share2 } from 'lucide-react';
import { SavedVideo } from '../../../types/video';
import { IconButton } from '../../../components/ui';
import { STAGE_LABEL, stageOf } from '../../../utils/garden';
import { spring } from '../../../styles/motion';
import GrowthMark from './GrowthMark';

/* A white card. Growth is shown by the plant at its left edge, never by a coloured border. */
const Card = styled(motion.article)`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 0.9rem;
  padding: 1.2rem 1.2rem 1rem 0.95rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: var(--radius-l);
  box-shadow: ${({ theme }) => theme.shadows.card};
  scroll-margin-top: 1.5rem;
`;

const Plant = styled.div`
  display: grid;
  justify-items: center;
  align-content: start;
  padding-top: 0.15rem;
`;

const Body = styled.div`
  display: grid;
  gap: 0.7rem;
  min-width: 0;
`;

const Stage = styled.div`
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.emberInk};

  span {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.ink3};
  }
`;

const Wisdom = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-style: italic;
  font-weight: 300;
  font-variation-settings: 'opsz' 72, 'SOFT' 100;
  font-size: 1.25rem;
  line-height: 1.32;
  color: ${({ theme }) => theme.colors.ink};
  text-wrap: pretty;
`;

const Meta = styled.div`
  font-size: 0.84rem;
  color: ${({ theme }) => theme.colors.ink2};

  strong {
    color: ${({ theme }) => theme.colors.ink};
    font-weight: 600;
  }
`;

const Note = styled.div`
  font-size: 0.94rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.ink2};
  padding: 0.75rem 0.95rem;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: var(--radius-s);
  white-space: pre-wrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;

  > :last-child {
    margin-left: auto;
  }
`;

interface VideoCardProps {
  video: SavedVideo;
  index?: number;
  onEdit: () => void;
  onDelete: () => void;
  onPlay: () => void;
  onShare: () => void;
}

const planted = (t: number) => new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

const VideoCard = ({ video, index = 0, onEdit, onDelete, onPlay, onShare }: VideoCardProps) => {
  const stage = stageOf(video);
  return (
    <Card
      id={`line-${video.id}`}
      layout="position"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ ...spring, delay: Math.min(index, 8) * 0.05 }}
    >
      <Plant>
        <GrowthMark stage={stage} />
      </Plant>
      <Body>
        <Stage>
          {STAGE_LABEL[stage]} <span>· planted {planted(video.savedAt)}{video.revisits ? ` · watched again ${video.revisits}×` : ''}</span>
        </Stage>
        <Wisdom>{video.wisdom}</Wisdom>
        <Meta>
          <strong>{video.thinker ?? video.title}</strong>
          {video.thinker && <> · {video.title}</>}
        </Meta>
        {video.notes && <Note>{video.notes}</Note>}
        <Actions>
          <IconButton $tone="forest" $size={44} onClick={onPlay} aria-label={`Watch ${video.title}`} whileTap={{ scale: 0.92 }}>
            <Play aria-hidden />
          </IconButton>
          <IconButton $size={44} onClick={onEdit} aria-label={video.notes ? 'Edit note' : 'Add a note'} whileTap={{ scale: 0.92 }}>
            <Pencil aria-hidden />
          </IconButton>
          <IconButton $size={44} onClick={onShare} aria-label="Share as a card" whileTap={{ scale: 0.92 }}>
            <Share2 aria-hidden />
          </IconButton>
          <IconButton $tone="danger" $size={44} onClick={onDelete} aria-label="Remove from the Garden" whileTap={{ scale: 0.92 }}>
            <Trash2 aria-hidden />
          </IconButton>
        </Actions>
      </Body>
    </Card>
  );
};

export default VideoCard;

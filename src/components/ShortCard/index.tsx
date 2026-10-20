import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Heart, Share2 } from 'lucide-react';
import { Video } from '../../data/videos';
import { Surface, Tag, IconButton } from '../ui';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addVideo, removeVideo } from '../../store/lovedVideosSlice';
import { spring } from '../../styles/motion';

const Card = styled(motion(Surface))`
  display: grid;
  gap: 0.8rem;
  padding: 1.25rem 1.25rem 1rem;
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
  font-size: 1.25rem;
  line-height: 1.32;
  color: ${({ theme }) => theme.colors.ink};
  text-wrap: pretty;
`;

const Meta = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.ink2};

  strong {
    color: ${({ theme }) => theme.colors.ink};
    font-weight: 700;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface ShortCardProps {
  video: Video;
  onPlay: (video: Video) => void;
  onShare?: (video: Video) => void;
  /** Hide the thinker in the meta line when the page is already about them. */
  hideThinker?: boolean;
}

/** A short at rest: its line, where it came from, watch and love. Used wherever the library is browsed. */
const ShortCard = ({ video, onPlay, onShare, hideThinker }: ShortCardProps) => {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector((s) => s.lovedVideos.videos.some((v) => v.id === video.id));

  const toggleLove = () => {
    if (isSaved) dispatch(removeVideo(video.id));
    else dispatch(addVideo({ ...video, notes: '', savedAt: Date.now() }));
  };

  return (
    <Card layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
      {video.categories.length > 0 && (
        <Tags>
          {video.categories.map((c) => (
            <Tag key={c}>{c}</Tag>
          ))}
        </Tags>
      )}
      <Wisdom>{video.wisdom}</Wisdom>
      <Meta>
        <strong>{video.title}</strong>
        {!hideThinker && video.thinker && <> · {video.thinker}</>}
        {video.creatorChannel && <> · via {video.creatorChannel}</>}
      </Meta>
      <Actions>
        <IconButton $tone="amber" onClick={() => onPlay(video)} aria-label={`Watch ${video.title}`} whileTap={{ scale: 0.92 }}>
          <Play />
        </IconButton>
        <IconButton $tone={isSaved ? 'amber' : 'ghost'} onClick={toggleLove} aria-label={isSaved ? 'Remove from loved' : 'Love this'} aria-pressed={isSaved} whileTap={{ scale: 0.92 }}>
          <Heart fill={isSaved ? 'currentColor' : 'none'} />
        </IconButton>
        {onShare && (
          <IconButton onClick={() => onShare(video)} aria-label="Share as a card" whileTap={{ scale: 0.92 }}>
            <Share2 />
          </IconButton>
        )}
      </Actions>
    </Card>
  );
};

export default ShortCard;

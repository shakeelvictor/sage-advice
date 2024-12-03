import { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import ReactPlayer from 'react-player';
import { SavedVideo } from '../../components/VideoPlayer';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import EditNotesModal from '../../components/EditNotesModal';
import PageTransition from '../../components/PageTransition';
import EmptyState from './components/EmptyState';
import VideoGrid from './components/VideoGrid';
import CategoryFilter from './components/CategoryFilter';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeVideo, updateVideoNotes } from '../../store/lovedVideosSlice';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 3rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const VideoOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const VideoWrapper = styled.div`
  width: 100%;
  max-width: 350px;
  aspect-ratio: 9/16;
  position: relative;
  background: black;
  border-radius: 1rem;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 2.5rem;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
  }

  svg {
    width: 24px;
    height: 24px;
  }

    &.center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Loved = () => {
  const dispatch = useAppDispatch();
  const savedVideos = useAppSelector(state => state.lovedVideos.videos);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deleteModalVideo, setDeleteModalVideo] = useState<SavedVideo | null>(null);
  const [editModalVideo, setEditModalVideo] = useState<SavedVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const uniqueCategories = Array.from(
    new Set(savedVideos.flatMap(video => video.categories))
  );

  const handleEdit = (video: SavedVideo) => {
    setEditModalVideo(video);
  };

  const handleSaveNotes = (notes: string) => {
    if (!editModalVideo) return;

    dispatch(updateVideoNotes({
      id: editModalVideo.id,
      notes
    }));
  };

  const handleDelete = (id: string) => {
    dispatch(removeVideo(id));
    setDeleteModalVideo(null);
  };

  return (
    <PageTransition>
      <Container>
        <Title>Loved Wisdom</Title>

        {savedVideos.length > 0 && (
          <CategoryFilter
            categories={uniqueCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {savedVideos.length === 0 ? (
          <EmptyState />
        ) : (
          <VideoGrid
            videos={savedVideos}
            selectedCategory={selectedCategory}
            onEdit={handleEdit}
            onDelete={setDeleteModalVideo}
            onPlay={setPlayingId}
          />
        )}

        <AnimatePresence>
          {playingId && (
            <VideoOverlay>
              <CloseButton className='center' onClick={() => setPlayingId(null)}>
                <IoClose />
              </CloseButton>
              <VideoWrapper>
                <ReactPlayer
                  url={`https://www.youtube.com/shorts/${playingId}`}
                  width="100%"
                  height="100%"
                  playing
                  controls
                  onEnded={() => setPlayingId(null)}
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                      }
                    }
                  }}
                />
              </VideoWrapper>
            </VideoOverlay>
          )}
        </AnimatePresence>

        <DeleteConfirmationModal
          isOpen={deleteModalVideo !== null}
          onClose={() => setDeleteModalVideo(null)}
          onConfirm={() => deleteModalVideo && handleDelete(deleteModalVideo.id)}
          title={deleteModalVideo?.title || ''}
        />

        <EditNotesModal
          isOpen={editModalVideo !== null}
          onClose={() => setEditModalVideo(null)}
          onSave={handleSaveNotes}
          initialNotes={editModalVideo?.notes || ''}
          title={editModalVideo?.title || ''}
        />
      </Container>
    </PageTransition>
  );
};

export default Loved;
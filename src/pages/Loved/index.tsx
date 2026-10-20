import { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { SavedVideo } from '../../types/video';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import EditNotesModal from '../../components/EditNotesModal';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import { Eyebrow, PageHeader, PageTitle, PageIntro } from '../../components/ui';
import EmptyState from './components/EmptyState';
import VideoGrid from './components/VideoGrid';
import CategoryFilter from './components/CategoryFilter';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeVideo, updateVideoNotes } from '../../store/lovedVideosSlice';

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Loved = () => {
  const dispatch = useAppDispatch();
  const savedVideos = useAppSelector((state) => state.lovedVideos.videos);
  const [playing, setPlaying] = useState<SavedVideo | null>(null);
  const [deleteModalVideo, setDeleteModalVideo] = useState<SavedVideo | null>(null);
  const [editModalVideo, setEditModalVideo] = useState<SavedVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const uniqueCategories = Array.from(new Set(savedVideos.flatMap((video) => video.categories)));
  const count = savedVideos.length;

  return (
    <PageTransition>
      <Container>
        <PageHeader>
          <Eyebrow>Kept</Eyebrow>
          <PageTitle>Loved</PageTitle>
          <PageIntro>
            {count === 0
              ? 'The lines that stay with you will gather here, with room for your own notes.'
              : `${count} ${count === 1 ? 'line' : 'lines'} you chose to keep. Add a note to remember why.`}
          </PageIntro>
        </PageHeader>

        {count > 0 && uniqueCategories.length > 1 && (
          <CategoryFilter categories={uniqueCategories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        )}

        {count === 0 ? (
          <EmptyState />
        ) : (
          <VideoGrid
            videos={savedVideos}
            selectedCategory={selectedCategory}
            onEdit={setEditModalVideo}
            onDelete={setDeleteModalVideo}
            onPlay={setPlaying}
          />
        )}

        <AnimatePresence>
          {playing && <PlayerSheet key={playing.id} video={playing} onClose={() => setPlaying(null)} onEnded={() => setPlaying(null)} />}
        </AnimatePresence>

        <DeleteConfirmationModal
          isOpen={deleteModalVideo !== null}
          onClose={() => setDeleteModalVideo(null)}
          onConfirm={() => deleteModalVideo && dispatch(removeVideo(deleteModalVideo.id))}
          title={deleteModalVideo?.title || ''}
        />

        <EditNotesModal
          key={editModalVideo?.id ?? 'none'}
          isOpen={editModalVideo !== null}
          onClose={() => setEditModalVideo(null)}
          onSave={(notes) => editModalVideo && dispatch(updateVideoNotes({ id: editModalVideo.id, notes }))}
          initialNotes={editModalVideo?.notes || ''}
          title={editModalVideo?.title || ''}
        />
      </Container>
    </PageTransition>
  );
};

export default Loved;

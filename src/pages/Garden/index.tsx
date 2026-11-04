import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { useLocation, useSearchParams } from 'react-router-dom';
import { SavedVideo } from '../../types/video';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import EditNotesModal from '../../components/EditNotesModal';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import WisdomCardModal from '../../components/WisdomCardModal';
import { Eyebrow, Headline } from '../../components/ui';
import EmptyState from './components/EmptyState';
import VideoGrid from './components/VideoGrid';
import CategoryFilter from './components/CategoryFilter';
import Journal from './components/Journal';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeVideo, touchVideo, updateVideoNotes } from '../../store/lovedVideosSlice';
import { logPractice } from '../../store/ritualSlice';
import { stageOf } from '../../utils/garden';

const Container = styled.div`
  max-width: 980px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;

  > * {
    min-width: 0;
  }
`;

const Top = styled.header`
  display: grid;
  gap: 0.6rem;
  max-width: 680px;

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 52ch;
  }
`;

const Section = styled.section`
  display: grid;
  gap: 1rem;
  scroll-margin-top: 1.5rem;

  h2 {
    font-size: 1.15rem;
    letter-spacing: -0.02em;
  }
`;

const Garden = () => {
  const dispatch = useAppDispatch();
  const savedVideos = useAppSelector((state) => state.lovedVideos.videos);
  const pathProgress = useAppSelector((state) => state.paths.progress);
  const weekNotes = useAppSelector((state) => state.ritual.weekNotes);
  const { hash } = useLocation();
  const [params] = useSearchParams();

  const [playing, setPlaying] = useState<SavedVideo | null>(null);
  const [deleteModalVideo, setDeleteModalVideo] = useState<SavedVideo | null>(null);
  const [editModalVideo, setEditModalVideo] = useState<SavedVideo | null>(null);
  const [sharing, setSharing] = useState<SavedVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const uniqueCategories = Array.from(new Set(savedVideos.flatMap((video) => video.categories)));
  const count = savedVideos.length;
  const blooms = savedVideos.filter((v) => stageOf(v) === 'bloom').length;
  const noted = savedVideos.filter((v) => v.notes?.trim()).length;

  // Deep links: #line-<id> from the journal, #journal, and the older ?view=journal|lines links.
  useEffect(() => {
    const legacy = params.get('view');
    const target = hash ? hash.slice(1) : legacy === 'journal' ? 'journal' : legacy === 'lines' ? 'lines' : null;
    if (!target) return;
    const t = window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    return () => window.clearTimeout(t);
  }, [hash, params]);

  const closePlayer = useCallback(() => setPlaying(null), []);
  const endPlayer = useCallback(() => {
    if (playing) {
      dispatch(touchVideo(playing.id));
      dispatch(logPractice({ kind: 'watch', at: Date.now(), id: playing.id }));
    }
    setPlaying(null);
  }, [dispatch, playing]);

  const intro =
    blooms > 0
      ? 'Everything you write about these lines gathers in the journal below.'
      : noted > 0
        ? 'Watch a noted line again and it comes into bloom.'
        : 'A note gives a line leaves. Coming back to it brings the bloom.';

  return (
    <PageTransition>
      <Container>
        <Top>
          <Eyebrow>Garden</Eyebrow>
          {count === 0 ? (
            <Headline>
              Your garden <span>is waiting.</span>
            </Headline>
          ) : (
            <Headline>
              {count} {count === 1 ? 'line' : 'lines'} kept, <span>{blooms > 0 ? `${blooms} in bloom.` : 'still growing.'}</span>
            </Headline>
          )}
          {count > 0 && <p>{intro}</p>}
        </Top>

        {count === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Section id="lines" aria-labelledby="lines-heading">
              <h2 id="lines-heading">Kept lines</h2>
              {uniqueCategories.length > 1 && (
                <CategoryFilter categories={uniqueCategories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
              )}
              <VideoGrid videos={savedVideos} selectedCategory={selectedCategory} onEdit={setEditModalVideo} onDelete={setDeleteModalVideo} onPlay={setPlaying} onShare={setSharing} />
            </Section>

            <Section id="journal" aria-labelledby="journal-heading">
              <h2 id="journal-heading">Journal</h2>
              <Journal videos={savedVideos} progress={pathProgress} weekNotes={weekNotes} />
            </Section>
          </>
        )}

        <AnimatePresence>
          {playing && <PlayerSheet key={playing.id} video={playing} onClose={closePlayer} onEnded={endPlayer} />}
        </AnimatePresence>

        <WisdomCardModal video={sharing} onClose={() => setSharing(null)} />

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

export default Garden;

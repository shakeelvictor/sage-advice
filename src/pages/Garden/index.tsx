import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SavedVideo } from '../../types/video';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import EditNotesModal from '../../components/EditNotesModal';
import PageTransition from '../../components/PageTransition';
import PlayerSheet from '../../components/Player/PlayerSheet';
import WisdomCardModal from '../../components/WisdomCardModal';
import { Eyebrow, PageHeader, PageTitle, PageIntro } from '../../components/ui';
import EmptyState from './components/EmptyState';
import VideoGrid from './components/VideoGrid';
import VideoCard from './components/VideoCard';
import CategoryFilter from './components/CategoryFilter';
import GardenView from './components/GardenView';
import Journal from './components/Journal';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { removeVideo, touchVideo, updateVideoNotes } from '../../store/lovedVideosSlice';
import { logPractice } from '../../store/ritualSlice';
import { STAGE_LABEL, stageOf } from '../../utils/garden';
import { springSnappy } from '../../styles/motion';

type View = 'garden' | 'lines' | 'journal';
const VIEWS: { id: View; label: string }[] = [
  { id: 'garden', label: 'Garden' },
  { id: 'lines', label: 'Lines' },
  { id: 'journal', label: 'Journal' },
];

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
`;

const Tabs = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};
  width: max-content;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  position: relative;
  min-height: 38px;
  padding: 0 1.1rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ $active, theme }) => ($active ? theme.colors.onAmber : theme.colors.ink2)};
  transition: color 0.25s ease;

  .label {
    position: relative;
    z-index: 1;
  }
`;

const TabPill = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.amber};
`;

const Selected = styled(motion.div)`
  display: grid;
  gap: 0.6rem;
  max-width: 560px;
`;

const StageLine = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.ink3};

  b {
    color: ${({ theme }) => theme.colors.amber};
    font-weight: 700;
  }
`;

const Garden = () => {
  const dispatch = useAppDispatch();
  const savedVideos = useAppSelector((state) => state.lovedVideos.videos);
  const pathProgress = useAppSelector((state) => state.paths.progress);
  const weekNotes = useAppSelector((state) => state.ritual.weekNotes);
  const [params, setParams] = useSearchParams();
  const view = (VIEWS.some((v) => v.id === params.get('view')) ? params.get('view') : 'garden') as View;
  const setView = (v: View) => setParams(v === 'garden' ? {} : { view: v }, { replace: true });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState<SavedVideo | null>(null);
  const [deleteModalVideo, setDeleteModalVideo] = useState<SavedVideo | null>(null);
  const [editModalVideo, setEditModalVideo] = useState<SavedVideo | null>(null);
  const [sharing, setSharing] = useState<SavedVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const uniqueCategories = Array.from(new Set(savedVideos.flatMap((video) => video.categories)));
  const count = savedVideos.length;
  const selected = useMemo(() => savedVideos.find((v) => v.id === selectedId) ?? null, [savedVideos, selectedId]);
  const blooms = savedVideos.filter((v) => stageOf(v) === 'bloom').length;

  const closePlayer = useCallback(() => setPlaying(null), []);
  const endPlayer = useCallback(() => {
    if (playing) {
      dispatch(touchVideo(playing.id));
      dispatch(logPractice({ kind: 'watch', at: Date.now(), id: playing.id }));
    }
    setPlaying(null);
  }, [dispatch, playing]);

  const intro =
    count === 0
      ? 'Love a line and it is planted here. Notes give it leaves; coming back to it brings the bloom.'
      : blooms > 0
        ? `${count} ${count === 1 ? 'line' : 'lines'} kept, ${blooms} in bloom. Everything you write about them lives in the journal.`
        : `${count} ${count === 1 ? 'line' : 'lines'} kept. Add a note or watch one again and it grows.`;

  return (
    <PageTransition>
      <Container>
        <PageHeader style={{ marginBottom: 0 }}>
          <Eyebrow>Kept</Eyebrow>
          <PageTitle>Garden</PageTitle>
          <PageIntro>{intro}</PageIntro>
        </PageHeader>

        {count === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Tabs role="tablist" aria-label="Garden views">
              {VIEWS.map((v) => (
                <TabButton key={v.id} role="tab" aria-selected={view === v.id} $active={view === v.id} onClick={() => setView(v.id)}>
                  {view === v.id && <TabPill layoutId="garden-tab" transition={springSnappy} />}
                  <span className="label">{v.label}</span>
                </TabButton>
              ))}
            </Tabs>

            {view === 'garden' && (
              <>
                <GardenView videos={savedVideos} selectedId={selectedId} onSelect={setSelectedId} />
                <AnimatePresence mode="wait">
                  {selected && (
                    <Selected key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                      <StageLine>
                        <b>{STAGE_LABEL[stageOf(selected)]}</b> · planted {new Date(selected.savedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        {selected.revisits ? ` · watched again ${selected.revisits} ${selected.revisits === 1 ? 'time' : 'times'}` : ''}
                      </StageLine>
                      <VideoCard video={selected} onPlay={() => setPlaying(selected)} onEdit={() => setEditModalVideo(selected)} onDelete={() => setDeleteModalVideo(selected)} onShare={() => setSharing(selected)} />
                    </Selected>
                  )}
                </AnimatePresence>
              </>
            )}

            {view === 'lines' && (
              <>
                {uniqueCategories.length > 1 && (
                  <CategoryFilter categories={uniqueCategories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                )}
                <VideoGrid videos={savedVideos} selectedCategory={selectedCategory} onEdit={setEditModalVideo} onDelete={setDeleteModalVideo} onPlay={setPlaying} onShare={setSharing} />
              </>
            )}

            {view === 'journal' && <Journal videos={savedVideos} progress={pathProgress} weekNotes={weekNotes} />}
          </>
        )}

        <AnimatePresence>
          {playing && <PlayerSheet key={playing.id} video={playing} onClose={closePlayer} onEnded={endPlayer} />}
        </AnimatePresence>

        <WisdomCardModal video={sharing} onClose={() => setSharing(null)} />

        <DeleteConfirmationModal
          isOpen={deleteModalVideo !== null}
          onClose={() => setDeleteModalVideo(null)}
          onConfirm={() => {
            if (!deleteModalVideo) return;
            dispatch(removeVideo(deleteModalVideo.id));
            if (selectedId === deleteModalVideo.id) setSelectedId(null);
          }}
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

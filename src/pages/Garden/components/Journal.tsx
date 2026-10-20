import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Search, Sprout, Compass, CalendarDays } from 'lucide-react';
import { SavedVideo } from '../../../types/video';
import { PathProgress } from '../../../store/pathsSlice';
import { paths, videoForStep } from '../../../data/paths';
import { Surface, Eyebrow } from '../../../components/ui';
import { questionForWeek } from '../../../utils/week';

interface Entry {
  id: string;
  date: number;
  kind: 'line' | 'path' | 'week';
  title: string;
  context: string;
  question?: string;
  text: string;
  to: string;
}

const Wrap = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 420px;
  padding: 0 1rem;
  min-height: 46px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink3};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.8;
    flex: none;
  }

  input {
    flex: 1;
    min-width: 0;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.ink};
    outline: none;
  }

  input::placeholder {
    color: ${({ theme }) => theme.colors.ink3};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.amber};
  }
`;

const Month = styled.section`
  display: grid;
  grid-template-columns: 7.5rem 1fr;
  gap: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
`;

const MonthLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.ink2};
  position: sticky;
  top: 1rem;
  align-self: start;
`;

const Entries = styled.div`
  display: grid;
  gap: 0.75rem;
  position: relative;
  padding-left: 1.25rem;

  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 0.75rem;
    bottom: 0.75rem;
    width: 1px;
    background: ${({ theme }) => theme.colors.line};
  }
`;

const Card = styled(Surface)`
  position: relative;
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.15rem;

  &::before {
    content: '';
    position: absolute;
    left: calc(-1.25rem - 0.5px);
    top: 1.25rem;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.amber};
    transform: translateX(-4px);
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.76rem;
  color: ${({ theme }) => theme.colors.ink3};

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  svg {
    width: 13px;
    height: 13px;
    stroke-width: 2;
  }
`;

const Title = styled(Link)`
  color: ${({ theme }) => theme.colors.ink};
  font-weight: 700;
  font-size: 0.95rem;

  &:hover {
    color: ${({ theme }) => theme.colors.amber};
  }
`;

const Question = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 300;
  font-variation-settings: 'SOFT' 70;
  font-size: 1.1rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.ink2};
`;

const Text = styled.p`
  white-space: pre-wrap;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.ink};
`;

const Empty = styled(Surface)`
  padding: 2.5rem 1.5rem;
  text-align: center;
  display: grid;
  gap: 0.5rem;
  justify-items: center;

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 44ch;
  }
`;

const dayLabel = (d: number) => new Date(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
const monthLabel = (d: number) => new Date(d).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

interface JournalProps {
  videos: SavedVideo[];
  progress: Record<string, PathProgress>;
  weekNotes?: Record<string, { text: string; at: number }>;
}

/** Everything you have written, in one place: notes on kept lines, reflections on path steps, and answers to the week's question. */
const Journal = ({ videos, progress, weekNotes = {} }: JournalProps) => {
  const [query, setQuery] = useState('');

  const entries = useMemo<Entry[]>(() => {
    const lines: Entry[] = videos
      .filter((v) => v.notes?.trim())
      .map((v) => ({
        id: `line-${v.id}`,
        date: v.notedAt ?? v.savedAt,
        kind: 'line',
        title: v.title,
        context: v.thinker ?? v.creatorChannel ?? 'Kept line',
        question: v.wisdom,
        text: v.notes,
        to: '/garden?view=lines',
      }));
    const steps: Entry[] = paths.flatMap((path) => {
      const p = progress[path.id];
      if (!p) return [];
      return Object.entries(p.reflections).map(([index, text]) => {
        const i = Number(index);
        const video = videoForStep(path.steps[i]);
        return {
          id: `path-${path.id}-${i}`,
          date: p.completedAt?.[i] ?? p.startedAt,
          kind: 'path' as const,
          title: video?.title ?? `Step ${i + 1}`,
          context: path.title,
          question: path.steps[i]?.question,
          text,
          to: `/paths/${path.id}`,
        };
      });
    });
    const weeks: Entry[] = Object.entries(weekNotes).map(([week, note]) => ({
      id: `week-${week}`,
      date: note.at,
      kind: 'week',
      title: `Week of ${new Date(`${week}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}`,
      context: 'Weekly reflection',
      question: questionForWeek(week),
      text: note.text,
      to: '/week',
    }));
    return [...lines, ...steps, ...weeks].sort((a, b) => b.date - a.date);
  }, [videos, progress, weekNotes]);

  const q = query.trim().toLowerCase();
  const shown = q
    ? entries.filter((e) => [e.text, e.title, e.context, e.question ?? ''].some((s) => s.toLowerCase().includes(q)))
    : entries;

  const months = shown.reduce<{ label: string; items: Entry[] }[]>((acc, e) => {
    const label = monthLabel(e.date);
    const last = acc[acc.length - 1];
    if (last?.label === label) last.items.push(e);
    else acc.push({ label, items: [e] });
    return acc;
  }, []);

  if (entries.length === 0) {
    return (
      <Empty>
        <Eyebrow>Journal</Eyebrow>
        <h2>Nothing written yet</h2>
        <p>Notes you add to kept lines, and what you write after each step of a path, gather here in order.</p>
      </Empty>
    );
  }

  return (
    <Wrap>
      <SearchBox>
        <Search aria-hidden />
        <input id="journal-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`} aria-label="Search your journal" />
      </SearchBox>

      {shown.length === 0 ? (
        <Empty>
          <p>Nothing matches “{query}”.</p>
        </Empty>
      ) : (
        months.map(({ label, items }) => (
          <Month key={label}>
            <MonthLabel>{label}</MonthLabel>
            <Entries>
              {items.map((e) => (
                <Card key={e.id}>
                  <Top>
                    <span>
                      {e.kind === 'line' ? <Sprout aria-hidden /> : e.kind === 'week' ? <CalendarDays aria-hidden /> : <Compass aria-hidden />}
                      {e.kind === 'line' ? 'Kept line' : e.context}
                    </span>
                    <span>{dayLabel(e.date)}</span>
                  </Top>
                  <Title to={e.to}>{e.title}{e.kind === 'line' && e.context !== 'Kept line' ? ` · ${e.context}` : ''}</Title>
                  {e.question && <Question>{e.question}</Question>}
                  <Text>{e.text}</Text>
                </Card>
              ))}
            </Entries>
          </Month>
        ))
      )}
    </Wrap>
  );
};

export default Journal;

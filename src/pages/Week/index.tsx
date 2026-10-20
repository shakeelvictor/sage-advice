import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, Button, TextButton, Surface } from '../../components/ui';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { saveWeekNote } from '../../store/ritualSlice';
import { questionForWeek, summarizeWeek, weekHeadline, weekKey } from '../../utils/week';
import { spring, springSoft } from '../../styles/motion';

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: grid;
  gap: 2.25rem;
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink2};

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.amber};
  }
`;

const Head = styled.header`
  display: grid;
  gap: 0.7rem;

  h1 {
    font-size: clamp(2rem, 5.2vw, 3.1rem);
    font-weight: 300;
    font-variation-settings: 'SOFT' 80;
    max-width: 18ch;
  }

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 56ch;
  }
`;

const Counts = styled(motion.dl)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
`;

const Count = styled(motion.div)`
  display: grid;
  gap: 0.2rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-m);
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};

  dt {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.ink3};
  }

  dd {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 2rem;
    line-height: 1;
    color: ${({ theme }) => theme.colors.ink};
    font-variant-numeric: tabular-nums;
  }

  dd small {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.ink2};
    margin-left: 0.35rem;
  }
`;

const Section = styled.section`
  display: grid;
  gap: 0.8rem;

  h2 {
    font-size: 1.4rem;
  }
`;

const Kept = styled.ul`
  list-style: none;
  display: grid;
  gap: 0.6rem;
`;

const KeptLine = styled.li`
  padding: 0.9rem 1.1rem;
  border-left: 2px solid ${({ theme }) => theme.colors.amber};
  background: color-mix(in srgb, ${({ theme }) => theme.colors.amber} 6%, transparent);
  border-radius: 0 var(--radius-s) var(--radius-s) 0;

  p {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 300;
    font-variation-settings: 'SOFT' 70;
    font-size: 1.15rem;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.ink};
  }

  small {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.ink3};
  }
`;

const Ask = styled(motion(Surface))`
  display: grid;
  gap: 0.9rem;
  padding: 1.5rem;

  h2 {
    font-weight: 300;
    font-variation-settings: 'SOFT' 80;
    font-size: clamp(1.4rem, 3.5vw, 1.8rem);
    line-height: 1.3;
  }

  textarea {
    width: 100%;
    min-height: 120px;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-m);
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: ${({ theme }) => theme.colors.ground};
    color: ${({ theme }) => theme.colors.ink};
    line-height: 1.6;
    resize: vertical;
  }

  textarea::placeholder {
    color: ${({ theme }) => theme.colors.ink3};
  }

  textarea:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.amber};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Saved = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.sage};
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;

  svg {
    width: 15px;
    height: 15px;
  }
`;

const Quiet = styled(Surface)`
  padding: 1.75rem;
  display: grid;
  gap: 0.6rem;
  justify-items: start;

  p {
    color: ${({ theme }) => theme.colors.ink2};
    max-width: 48ch;
  }
`;

const list = { show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: spring } };

const rangeLabel = (start: number, end: number) => {
  const f = (t: number) => new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return `${f(start)} – ${f(end)}`;
};

const Week = () => {
  const dispatch = useAppDispatch();
  const { practiceDays, events, weekNotes } = useAppSelector((s) => s.ritual);
  const saved = useAppSelector((s) => s.lovedVideos.videos);
  const progress = useAppSelector((s) => s.paths.progress);

  const summary = useMemo(() => summarizeWeek(practiceDays, events, saved, progress), [practiceDays, events, saved, progress]);
  const key = weekKey();
  const question = questionForWeek(key);
  const existing = weekNotes?.[key]?.text ?? '';
  const [draft, setDraft] = useState(existing);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const save = () => {
    dispatch(saveWeekNote({ week: key, text: draft }));
    setSavedAt(Date.now());
  };

  return (
    <PageTransition>
      <Container>
        <Back to="/">
          <ArrowLeft /> Today
        </Back>

        <Head>
          <Eyebrow>The past seven days · {rangeLabel(summary.start, summary.end)}</Eyebrow>
          <h1>{weekHeadline(summary)}</h1>
          <p>
            {summary.empty
              ? 'Nothing was counted this week, and nothing is owed. The lines are here when you want them.'
              : `${summary.practiceDays} of 7 days with some practice in them. A count, not a streak: a quiet week breaks nothing.`}
          </p>
        </Head>

        {summary.empty ? (
          <Quiet>
            <p>Begin with one line, or one minute of stillness.</p>
            <Button as={Link} to="/">Find a line</Button>
          </Quiet>
        ) : (
          <Counts initial="hidden" animate="show" variants={list}>
            <Count variants={item}>
              <dt>Days of practice</dt>
              <dd>
                {summary.practiceDays}
                <small>of 7</small>
              </dd>
            </Count>
            <Count variants={item}>
              <dt>Lines sat with</dt>
              <dd>{summary.watched.length}</dd>
            </Count>
            <Count variants={item}>
              <dt>Lines kept</dt>
              <dd>{summary.kept.length}</dd>
            </Count>
            <Count variants={item}>
              <dt>Notes written</dt>
              <dd>{summary.notes}</dd>
            </Count>
            <Count variants={item}>
              <dt>Sits</dt>
              <dd>
                {summary.sits}
                {summary.sitMinutes > 0 && <small>{summary.sitMinutes} min</small>}
              </dd>
            </Count>
            <Count variants={item}>
              <dt>Path steps</dt>
              <dd>{summary.steps}</dd>
            </Count>
          </Counts>
        )}

        {summary.kept.length > 0 && (
          <Section>
            <Eyebrow>What stayed with you</Eyebrow>
            <Kept>
              {summary.kept.slice(0, 5).map((v) => (
                <KeptLine key={v.id}>
                  <p>{v.wisdom}</p>
                  <small>
                    {v.thinker ?? v.title}
                    {v.thinker ? ` · ${v.title}` : ''}
                  </small>
                </KeptLine>
              ))}
            </Kept>
            {summary.kept.length > 5 && <TextButton as={Link} to="/garden">And {summary.kept.length - 5} more in the Garden</TextButton>}
          </Section>
        )}

        {summary.pathsTouched.length > 0 && (
          <Section>
            <Eyebrow>Paths walked</Eyebrow>
            <p style={{ color: 'var(--ink-2)' }}>{summary.pathsTouched.join(' · ')}</p>
          </Section>
        )}

        <Ask initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springSoft, delay: 0.3 }}>
          <Eyebrow>A question to end the week</Eyebrow>
          <h2>{question}</h2>
          <textarea
            id="week-note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Answer in a line or a page. It joins your journal."
          />
          <Row>
            <Button onClick={save} disabled={draft.trim() === existing.trim() && !savedAt} whileTap={{ scale: 0.97 }}>
              {existing ? 'Update answer' : 'Keep this answer'}
            </Button>
            {(savedAt || existing) && (
              <Saved>
                <Check /> {savedAt ? 'Kept in your journal' : 'Answered earlier this week'}
              </Saved>
            )}
          </Row>
        </Ask>
      </Container>
    </PageTransition>
  );
};

export default Week;

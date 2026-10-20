import { videos, Video } from '../data/videos';
import { paths } from '../data/paths';
import { SavedVideo } from '../types/video';
import { PathProgress } from '../store/pathsSlice';
import { PracticeEvent } from '../store/ritualSlice';
import { hash, todayKey } from './ritual';

const DAY = 24 * 60 * 60 * 1000;

/** The past seven days, today included, as a [start, end] window in ms. */
export const weekWindow = (now = new Date()) => {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setTime(start.getTime() - 6 * DAY);
  return { start: start.getTime(), end: end.getTime() };
};

/** Monday of the current week, as a stable key for the week's question and note. */
export const weekKey = (now = new Date()) => {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setTime(d.getTime() - day * DAY);
  return todayKey(d);
};

export const WEEK_QUESTIONS = [
  'What did you understand this week that you only knew before?',
  'Which line would you want to remember in a year? Why that one?',
  'Where did you act with more wisdom than you expected of yourself?',
  'What are you carrying into next week that you could set down?',
  'Who did you treat better because of something you sat with?',
  'What did you avoid this week, and what would it cost to face it?',
  'When were you most present? What made that possible?',
  'What would the person you are becoming say about this week?',
  'What is one small practice that actually held up when things got hard?',
  'What did you learn about what you can and cannot control?',
  'Where did you confuse comfort with peace?',
  'What are you grateful for that you did not notice until now?',
];

export const questionForWeek = (key: string) => WEEK_QUESTIONS[hash(key) % WEEK_QUESTIONS.length];

export interface WeekSummary {
  start: number;
  end: number;
  practiceDays: number;
  /** Distinct shorts watched to the end. */
  watched: Video[];
  kept: SavedVideo[];
  notes: number;
  sits: number;
  sitMinutes: number;
  steps: number;
  pathsTouched: string[];
  empty: boolean;
}

export const summarizeWeek = (
  practiceDays: string[],
  events: PracticeEvent[] | undefined,
  saved: SavedVideo[],
  progress: Record<string, PathProgress>,
  now = new Date(),
): WeekSummary => {
  const { start, end } = weekWindow(now);
  const inWeek = (t?: number) => t !== undefined && t >= start && t <= end;

  const days = new Set<string>();
  for (let i = 0; i < 7; i++) days.add(todayKey(new Date(start + i * DAY)));
  const practised = practiceDays.filter((d) => days.has(d)).length;

  const watchedIds = new Set((events ?? []).filter((e) => e.kind === 'watch' && inWeek(e.at)).map((e) => (e as { id: string }).id));
  const watched = videos.filter((v) => watchedIds.has(v.id));
  const sits = (events ?? []).filter((e): e is Extract<PracticeEvent, { kind: 'sit' }> => e.kind === 'sit' && inWeek(e.at));

  const kept = saved.filter((v) => inWeek(v.savedAt)).sort((a, b) => b.savedAt - a.savedAt);
  const lineNotes = saved.filter((v) => v.notes?.trim() && inWeek(v.notedAt)).length;

  let steps = 0;
  let stepNotes = 0;
  const pathsTouched: string[] = [];
  for (const path of paths) {
    const p = progress[path.id];
    if (!p?.completedAt) continue;
    const walked = Object.entries(p.completedAt).filter(([, at]) => inWeek(at));
    if (walked.length === 0) continue;
    steps += walked.length;
    stepNotes += walked.filter(([i]) => p.reflections[Number(i)]).length;
    pathsTouched.push(path.title);
  }

  const summary: WeekSummary = {
    start,
    end,
    practiceDays: practised,
    watched,
    kept,
    notes: lineNotes + stepNotes,
    sits: sits.length,
    sitMinutes: sits.reduce((sum, s) => sum + s.minutes, 0),
    steps,
    pathsTouched,
    empty: false,
  };
  summary.empty = practised === 0 && watched.length === 0 && kept.length === 0 && summary.notes === 0 && sits.length === 0 && steps === 0;
  return summary;
};

/** The sentence that opens the week, written from what actually happened. */
export const weekHeadline = (s: WeekSummary) => {
  if (s.empty) return 'A quiet week.';
  const ideas = s.watched.length;
  if (ideas > 0 && s.sits > 0) return `You sat with ${ideas} ${ideas === 1 ? 'idea' : 'ideas'} and were still ${s.sits} ${s.sits === 1 ? 'time' : 'times'}.`;
  if (ideas > 0) return `You sat with ${ideas} ${ideas === 1 ? 'idea' : 'ideas'} this week.`;
  if (s.sits > 0) return `You were still ${s.sits} ${s.sits === 1 ? 'time' : 'times'} this week.`;
  if (s.kept.length > 0) return `You kept ${s.kept.length} ${s.kept.length === 1 ? 'line' : 'lines'} this week.`;
  return 'You showed up this week.';
};

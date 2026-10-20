import { videos, Video } from '../data/videos';

export type Intent = 'calm' | 'courage' | 'clarity' | 'comfort';

export const INTENTS: { id: Intent; label: string; blurb: string }[] = [
  { id: 'calm', label: 'Calm', blurb: 'Quiet the noise' },
  { id: 'courage', label: 'Courage', blurb: 'Face what is hard' },
  { id: 'clarity', label: 'Clarity', blurb: 'See it straight' },
  { id: 'comfort', label: 'Comfort', blurb: 'Be held a while' },
];

/** Categories that stand in for a mood on videos that have not been hand-tagged yet. */
const FALLBACK: Record<Intent, Video['categories']> = {
  calm: ['mindfulness', 'well-being'],
  courage: ['motivation'],
  clarity: ['philosophy'],
  comfort: ['well-being'],
};

export const intentLabel = (intent: Intent) => INTENTS.find((i) => i.id === intent)?.label ?? intent;

/** Local calendar date, so "today" rolls over at the user's midnight, not UTC's. */
export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** Every video that fits an intent: hand-tagged moods first, then the fallback categories. */
export const videosForIntent = (intent: Intent | null): Video[] => {
  if (!intent) return videos;
  const tagged = videos.filter((v) => v.mood?.includes(intent));
  const byCategory = videos.filter((v) => !v.mood?.length && v.categories.some((c) => FALLBACK[intent].includes(c)));
  return [...tagged, ...byCategory];
};

/**
 * The one short for a given day and intent. Deterministic, so reopening the app shows the same
 * line all day; loved videos step aside for ones not yet kept.
 */
export const pickDaily = (date: string, intent: Intent | null, excludeIds: string[] = []): Video => {
  const pool = videosForIntent(intent);
  const fresh = pool.filter((v) => !excludeIds.includes(v.id));
  const candidates = fresh.length > 0 ? fresh : pool.length > 0 ? pool : videos;
  return candidates[hash(`${date}:${intent ?? 'any'}`) % candidates.length];
};

/** A different short in the same mood, for wandering past today's line. */
export const pickAnother = (intent: Intent | null, currentId: string, excludeIds: string[] = []): Video => {
  const pool = videosForIntent(intent).filter((v) => v.id !== currentId);
  const fresh = pool.filter((v) => !excludeIds.includes(v.id));
  const candidates = fresh.length > 0 ? fresh : pool.length > 0 ? pool : videos.filter((v) => v.id !== currentId);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

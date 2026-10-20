import { SavedVideo } from '../types/video';
import { hash } from './ritual';

export type Stage = 'sprout' | 'leaf' | 'bloom';

/**
 * A kept line grows when you return to it: a sprout when saved, leaves once you write a note
 * or watch it again, a bloom once you have done both.
 */
export const stageOf = (video: SavedVideo): Stage => {
  const noted = Boolean(video.notes?.trim());
  const revisited = (video.revisits ?? 0) > 0;
  if (noted && revisited) return 'bloom';
  if (noted || revisited) return 'leaf';
  return 'sprout';
};

export const STAGE_LABEL: Record<Stage, string> = { sprout: 'Sprout', leaf: 'In leaf', bloom: 'In bloom' };

export interface Plant {
  video: SavedVideo;
  stage: Stage;
  /** 0..1 across the bed. */
  x: number;
  /** Stem height in viewBox units. */
  height: number;
  /** Which way the stem leans. */
  lean: number;
  leaves: number;
  seed: number;
}

/** Lay plants out in planting order with a little hashed jitter so the bed looks grown, not charted. */
export const layoutGarden = (videos: SavedVideo[]): Plant[] => {
  const ordered = [...videos].sort((a, b) => a.savedAt - b.savedAt);
  const n = ordered.length;
  return ordered.map((video, i) => {
    const seed = hash(video.id);
    const jitter = ((seed % 1000) / 1000 - 0.5) * (0.6 / Math.max(n, 1));
    const stage = stageOf(video);
    const base = stage === 'bloom' ? 150 : stage === 'leaf' ? 112 : 72;
    return {
      video,
      stage,
      x: Math.min(0.94, Math.max(0.06, (i + 0.5) / n + jitter)),
      height: base + (seed % 23),
      lean: (((seed >> 8) % 100) / 100 - 0.5) * 28,
      leaves: stage === 'sprout' ? 2 : 3 + ((seed >> 4) % 2),
      seed,
    };
  });
};

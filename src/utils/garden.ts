import { SavedVideo } from '../types/video';

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

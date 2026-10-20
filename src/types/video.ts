import { Video } from '../data/videos';

export interface SavedVideo extends Video {
  notes: string;
  savedAt: number;
  /** When the note was last written. */
  notedAt?: number;
  /** How many times it has been watched again from the Garden. */
  revisits?: number;
  lastVisited?: number;
}

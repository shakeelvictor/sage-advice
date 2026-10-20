import { Video } from '../data/videos';

export interface SavedVideo extends Video {
  notes: string;
  savedAt: number;
}

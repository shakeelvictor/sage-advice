import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavedVideo } from '../types/video';

interface LovedVideosState {
  videos: SavedVideo[];
}

const initialState: LovedVideosState = {
  videos: [],
};

const lovedVideosSlice = createSlice({
  name: 'lovedVideos',
  initialState,
  reducers: {
    addVideo: (state, action: PayloadAction<SavedVideo>) => {
      if (!state.videos.some((v) => v.id === action.payload.id)) state.videos.push(action.payload);
    },
    removeVideo: (state, action: PayloadAction<string>) => {
      state.videos = state.videos.filter((video) => video.id !== action.payload);
    },
    updateVideoNotes: (state, action: PayloadAction<{ id: string; notes: string }>) => {
      const video = state.videos.find((v) => v.id === action.payload.id);
      if (video) {
        video.notes = action.payload.notes;
        video.notedAt = action.payload.notes.trim() ? Date.now() : undefined;
      }
    },
    /** Watched again from the Garden: the plant grows. */
    touchVideo: (state, action: PayloadAction<string>) => {
      const video = state.videos.find((v) => v.id === action.payload);
      if (video) {
        video.revisits = (video.revisits ?? 0) + 1;
        video.lastVisited = Date.now();
      }
    },
  },
});

export const { addVideo, removeVideo, updateVideoNotes, touchVideo } = lovedVideosSlice.actions;
export default lovedVideosSlice.reducer;

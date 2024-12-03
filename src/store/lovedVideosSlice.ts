import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavedVideo } from '../components/VideoPlayer';

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
      state.videos.push(action.payload);
    },
    removeVideo: (state, action: PayloadAction<string>) => {
      state.videos = state.videos.filter(video => video.id !== action.payload);
    },
    updateVideoNotes: (state, action: PayloadAction<{ id: string; notes: string }>) => {
      const video = state.videos.find(v => v.id === action.payload.id);
      if (video) {
        video.notes = action.payload.notes;
      }
    },
  },
});

export const { addVideo, removeVideo, updateVideoNotes } = lovedVideosSlice.actions;
export default lovedVideosSlice.reducer;
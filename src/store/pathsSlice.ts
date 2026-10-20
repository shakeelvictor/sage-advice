import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PathProgress {
  /** Step indices walked, in the order they were completed. */
  done: number[];
  /** What you wrote after each step, by step index. */
  reflections: Record<number, string>;
  startedAt: number;
  finishedAt?: number;
}

interface PathsState {
  progress: Record<string, PathProgress>;
}

const initialState: PathsState = { progress: {} };

const pathsSlice = createSlice({
  name: 'paths',
  initialState,
  reducers: {
    completeStep: (
      state,
      action: PayloadAction<{ pathId: string; step: number; reflection: string; totalSteps: number }>,
    ) => {
      const { pathId, step, reflection, totalSteps } = action.payload;
      const progress = (state.progress[pathId] ??= { done: [], reflections: {}, startedAt: Date.now() });
      if (!progress.done.includes(step)) progress.done.push(step);
      if (reflection.trim()) progress.reflections[step] = reflection.trim();
      else delete progress.reflections[step];
      if (progress.done.length >= totalSteps && !progress.finishedAt) progress.finishedAt = Date.now();
    },
    resetPath: (state, action: PayloadAction<string>) => {
      delete state.progress[action.payload];
    },
  },
});

export const { completeStep, resetPath } = pathsSlice.actions;
export default pathsSlice.reducer;

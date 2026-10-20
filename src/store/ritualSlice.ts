import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Intent } from '../utils/ritual';

export interface TodayRitual {
  date: string;
  intent: Intent | null;
  videoId: string;
}

interface RitualState {
  today: TodayRitual | null;
  /** Calendar dates on which a short was watched to the end. A count, never a streak. */
  practiceDays: string[];
}

const initialState: RitualState = {
  today: null,
  practiceDays: [],
};

const ritualSlice = createSlice({
  name: 'ritual',
  initialState,
  reducers: {
    setToday: (state, action: PayloadAction<TodayRitual>) => {
      state.today = action.payload;
    },
    markPracticed: (state, action: PayloadAction<string>) => {
      if (!state.practiceDays.includes(action.payload)) {
        state.practiceDays.push(action.payload);
      }
    },
  },
});

export const { setToday, markPracticed } = ritualSlice.actions;
export default ritualSlice.reducer;

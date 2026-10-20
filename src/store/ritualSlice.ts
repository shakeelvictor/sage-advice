import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Intent, todayKey } from '../utils/ritual';

export interface TodayRitual {
  date: string;
  intent: Intent | null;
  videoId: string;
}

export type PracticeEvent =
  | { kind: 'watch'; at: number; id: string }
  | { kind: 'sit'; at: number; minutes: number; pattern?: string };

interface RitualState {
  today: TodayRitual | null;
  /** Calendar dates on which something was practised. A count, never a streak. */
  practiceDays: string[];
  /** What was practised and when, so a week can be looked back on. */
  events: PracticeEvent[];
  /** Your answer to the week's question, by week key. */
  weekNotes: Record<string, { text: string; at: number }>;
}

const initialState: RitualState = {
  today: null,
  practiceDays: [],
  events: [],
  weekNotes: {},
};

const MAX_EVENTS = 2000;

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
    /** Record a finished short or sit; the day counts as practised. */
    logPractice: (state, action: PayloadAction<PracticeEvent>) => {
      state.events ??= [];
      state.events.push(action.payload);
      if (state.events.length > MAX_EVENTS) state.events.splice(0, state.events.length - MAX_EVENTS);
      const day = todayKey(new Date(action.payload.at));
      if (!state.practiceDays.includes(day)) state.practiceDays.push(day);
    },
    saveWeekNote: (state, action: PayloadAction<{ week: string; text: string }>) => {
      state.weekNotes ??= {};
      const text = action.payload.text.trim();
      if (text) state.weekNotes[action.payload.week] = { text, at: Date.now() };
      else delete state.weekNotes[action.payload.week];
    },
  },
});

export const { setToday, markPracticed, logPractice, saveWeekNote } = ritualSlice.actions;
export default ritualSlice.reducer;

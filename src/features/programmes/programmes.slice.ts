import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { Programme } from '../../types';
import { dummyProgrammes } from '../../data/dummyData';

interface ProgrammesState {
  items: Programme[];
}

const initialState: ProgrammesState = {
  items: dummyProgrammes,
};

const programmesSlice = createSlice({
  name: 'programmes',
  initialState,
  reducers: {
    addProgramme(state, action: PayloadAction<Omit<Programme, 'id'>>) {
      state.items.push({ ...action.payload, id: nanoid() });
    },
    updateProgramme(state, action: PayloadAction<Programme>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteProgramme(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addProgramme, updateProgramme, deleteProgramme } = programmesSlice.actions;
export default programmesSlice.reducer;

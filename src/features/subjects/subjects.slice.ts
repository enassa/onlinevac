import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { Subject, SubjectType } from '../../types';
import { dummySubjects } from '../../data/dummyData';

interface SubjectsState {
  items: Subject[];
}

const initialState: SubjectsState = {
  items: dummySubjects,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    addSubject(state, action: PayloadAction<Omit<Subject, 'id'>>) {
      state.items.push({ ...action.payload, id: nanoid() });
    },
    updateSubject(state, action: PayloadAction<Subject>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteSubject(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addSubject, updateSubject, deleteSubject } = subjectsSlice.actions;
export default subjectsSlice.reducer;

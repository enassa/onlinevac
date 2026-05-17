import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { Teacher } from '../../types';
import { dummyTeachers } from '../../data/dummyData';

interface TeachersState {
  items: Teacher[];
}

const initialState: TeachersState = {
  items: dummyTeachers,
};

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    addTeacher(state, action: PayloadAction<Omit<Teacher, 'id'>>) {
      state.items.push({ ...action.payload, id: nanoid() });
    },
    updateTeacher(state, action: PayloadAction<Teacher>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteTeacher(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addTeacher, updateTeacher, deleteTeacher } = teachersSlice.actions;
export default teachersSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { Student } from '../../types';
import { dummyStudents } from '../../data/dummyData';

interface StudentsState {
  items: Student[];
}

const initialState: StudentsState = {
  items: dummyStudents,
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent(state, action: PayloadAction<Omit<Student, 'id'>>) {
      state.items.push({ ...action.payload, id: nanoid() });
    },
    updateStudent(state, action: PayloadAction<Student>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteStudent(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    joinProgramme(state, action: PayloadAction<{ studentId: string; programmeId: string }>) {
      const student = state.items.find((item) => item.id === action.payload.studentId);
      if (student) student.programmeId = action.payload.programmeId;
    },
  },
});

export const { addStudent, updateStudent, deleteStudent, joinProgramme } = studentsSlice.actions;
export default studentsSlice.reducer;

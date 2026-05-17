import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { VacationClass, TeacherAvailability, TeacherSubjectPreference, VacationClassStatus } from '../../types';
import type { SchedulerReport } from '../timetable/scheduler';
import { dummyVacationClass } from '../../data/dummyData';

interface VacationClassState {
  items: VacationClass[];
}

const initialState: VacationClassState = {
  items: [dummyVacationClass],
};

const vacationClassSlice = createSlice({
  name: 'vacationClass',
  initialState,
  reducers: {
    addVacationClass(state, action: PayloadAction<Omit<VacationClass, 'id'>>) {
      state.items.push({ ...action.payload, id: nanoid() });
    },
    updateVacationClass(state, action: PayloadAction<VacationClass>) {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    deleteVacationClass(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateVacationClassStatus(state, action: PayloadAction<{ id: string; status: VacationClassStatus }>) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) item.status = action.payload.status;
    },
    updateTeacherAvailability(state, action: PayloadAction<{ vacationClassId: string; availabilities: TeacherAvailability[] }>) {
      const item = state.items.find((item) => item.id === action.payload.vacationClassId);
      if (item) item.teacherAvailabilities = action.payload.availabilities;
    },
    updateTeacherSubjectPreferences(state, action: PayloadAction<{ vacationClassId: string; preferences: TeacherSubjectPreference[] }>) {
      const item = state.items.find((item) => item.id === action.payload.vacationClassId);
      if (item) item.teacherSubjectPreferences = action.payload.preferences;
    },
    setTimetableId(state, action: PayloadAction<{ vacationClassId: string; timetableId: string }>) {
      const item = state.items.find((item) => item.id === action.payload.vacationClassId);
      if (item) item.timetableId = action.payload.timetableId;
    },
    setVacationClassReport(state, action: PayloadAction<{ vacationClassId: string; report: SchedulerReport }>) {
      const item = state.items.find((item) => item.id === action.payload.vacationClassId);
      if (item) item.lastReport = action.payload.report;
    },
  },
});

export const {
  addVacationClass,
  updateVacationClass,
  deleteVacationClass,
  updateVacationClassStatus,
  updateTeacherAvailability,
  updateTeacherSubjectPreferences,
  setTimetableId,
  setVacationClassReport,
} = vacationClassSlice.actions;
export default vacationClassSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Timetable, TimeSlot } from '../../types';
import { dummyTimetable } from '../../data/dummyData';

interface TimetableState {
  items: Timetable[];
}

const initialState: TimetableState = {
  items: [dummyTimetable],
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    addTimetable(state, action: PayloadAction<Timetable>) {
      state.items.push(action.payload);
    },
    updateTimetableSlots(state, action: PayloadAction<{ id: string; slots: TimeSlot[] }>) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.slots = action.payload.slots;
        item.generatedAt = new Date().toISOString();
      }
    },
    updateTimeSlot(state, action: PayloadAction<{ timetableId: string; slot: TimeSlot }>) {
      const timetable = state.items.find((item) => item.id === action.payload.timetableId);
      const slotIndex = timetable?.slots.findIndex((slot) => slot.id === action.payload.slot.id) ?? -1;
      if (timetable && slotIndex !== -1) {
        timetable.slots[slotIndex] = action.payload.slot;
      }
    },
    deleteTimetable(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    deleteTimetablesForVacationClass(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.vacationClassId !== action.payload);
    },
  },
});

export const { addTimetable, updateTimetableSlots, updateTimeSlot, deleteTimetable, deleteTimetablesForVacationClass } = timetableSlice.actions;
export default timetableSlice.reducer;

import { http } from '../utils/httpClient';
import { getDispatch, getState } from './storeRef';
import { updateTimeSlot } from '../features/timetable/timetable.slice';
import { addToast } from '../features/toast/toast.slice';
import type { Timetable, TimeSlot } from '../types';

export const timetablesApi = {
  async getAll(): Promise<Timetable[]> {
    try {
      return await http.get<Timetable[]>('/timetables');
    } catch {
      return getState().timetable.items;
    }
  },

  async getByVacationClass(vacationClassId: string): Promise<Timetable | undefined> {
    try {
      return await http.get<Timetable>(`/timetables/vacation-class/${vacationClassId}`);
    } catch {
      return getState().timetable.items.find((tt) => tt.vacationClassId === vacationClassId);
    }
  },

  async getSlotsForTeacher(teacherId: string): Promise<TimeSlot[]> {
    try {
      const timetables = await this.getAll();
      return timetables.flatMap((tt) => tt.slots.filter((slot) => slot.teacherId === teacherId));
    } catch {
      const timetables = getState().timetable.items;
      return timetables.flatMap((tt) => tt.slots.filter((slot) => slot.teacherId === teacherId));
    }
  },

  async getSlotsForStudent(studentId: string): Promise<TimeSlot[]> {
    try {
      const state = getState();
      const student = state.students.items.find((stu) => stu.id === studentId);
      if (!student || !student.programmeId) return [];

      const programme = state.programmes.items.find((prog) => prog.id === student.programmeId);
      if (!programme) return [];

      const mySubjectIds = [...programme.coreSubjectIds, ...programme.electiveSubjectIds];
      const timetables = await this.getAll();

      return timetables.flatMap((tt) =>
        tt.slots.filter((slot) =>
          slot.programmeIds.includes(student.programmeId) && mySubjectIds.includes(slot.subjectId)
        )
      );
    } catch {
      const state = getState();
      const student = state.students.items.find((stu) => stu.id === studentId);
      if (!student || !student.programmeId) return [];

      const programme = state.programmes.items.find((prog) => prog.id === student.programmeId);
      if (!programme) return [];

      const mySubjectIds = [...programme.coreSubjectIds, ...programme.electiveSubjectIds];
      const timetables = state.timetable.items;

      return timetables.flatMap((tt) =>
        tt.slots.filter((slot) =>
          slot.programmeIds.includes(student.programmeId) && mySubjectIds.includes(slot.subjectId)
        )
      );
    }
  },

  getSlotForCell(day: string, hour: number, slots: TimeSlot[]): TimeSlot | null {
    return slots.find((slot) => slot.day === day && slot.startHour === hour) || null;
  },

  async startClass(timetableId: string, slotId: string, meetingLink: string): Promise<TimeSlot | null> {
    try {
      const timetable = await http.patch<Timetable>(`/timetables/${timetableId}/slots/${slotId}`, { meetingLink, status: 'live' });
      const slot = timetable.slots.find((item) => item.id === slotId);
      getDispatch()(updateTimeSlot({ timetableId, slot: slot || timetable.slots[0] }));
      getDispatch()(addToast({ message: 'Class is now live', type: 'success' }));
      return slot || null;
    } catch {
      const timetable = getState().timetable.items.find((item) => item.id === timetableId);
      const slot = timetable?.slots.find((item) => item.id === slotId);
      if (!timetable || !slot) {
        getDispatch()(addToast({ message: 'Class session not found', type: 'error' }));
        return null;
      }

      const updatedSlot: TimeSlot = {
        ...slot,
        meetingLink,
        status: 'live',
      };

      getDispatch()(updateTimeSlot({ timetableId, slot: updatedSlot }));
      getDispatch()(addToast({ message: 'Class is now live', type: 'success' }));
      return updatedSlot;
    }
  },
};

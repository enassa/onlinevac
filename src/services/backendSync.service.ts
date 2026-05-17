import { http } from '../utils/httpClient';
import { Subject, Programme, Teacher, Student, VacationClass, Timetable } from '../types';
import { dummySubjects, dummyProgrammes, dummyTeachers, dummyStudents, dummyVacationClass, dummyTimetable } from '../data/dummyData';

export const backendSyncService = {
  async bootstrap(): Promise<void> {
    try {
      await http.put('/bootstrap', {
        subjects: dummySubjects,
        programmes: dummyProgrammes,
        teachers: dummyTeachers,
        students: dummyStudents,
        vacationClasses: [dummyVacationClass],
        timetables: [dummyTimetable],
      });
      console.log('Backend bootstrapped successfully');
    } catch (error) {
      console.error('Failed to bootstrap backend:', error);
      throw error;
    }
  },

  async isBackendAvailable(): Promise<boolean> {
    try {
      await http.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};

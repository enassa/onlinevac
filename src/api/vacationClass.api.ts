import { http } from '../utils/httpClient';
import { getDispatch, getState } from './storeRef';
import { addVacationClass, updateVacationClass, updateVacationClassStatus, deleteVacationClass, setTimetableId, setVacationClassReport, updateTeacherAvailability, updateTeacherSubjectPreferences } from '../features/vacation-class/vacationClass.slice';
import { addTimetable, deleteTimetablesForVacationClass } from '../features/timetable/timetable.slice';
import { addToast } from '../features/toast/toast.slice';
import { generateTimetable } from '../features/timetable/scheduler';
import type { SchedulerReport } from '../features/timetable/scheduler';
import { nanoid } from 'nanoid';
import type { VacationClass, TeacherAvailability, TeacherSubjectPreference, VacationClassStatus } from '../types';

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Store the last generated report so the UI can access it
let lastReport: SchedulerReport | null = null;

export const vacationClassApi = {
  async getAll(): Promise<VacationClass[]> {
    try {
      return await http.get<VacationClass[]>('/vacation-classes');
    } catch {
      return getState().vacationClass.items;
    }
  },

  async getById(vacationClassId: string): Promise<VacationClass | undefined> {
    try {
      return await http.get<VacationClass>(`/vacation-classes/${vacationClassId}`);
    } catch {
      return getState().vacationClass.items.find((vc) => vc.id === vacationClassId);
    }
  },

  async getActive(): Promise<VacationClass | undefined> {
    try {
      return await http.get<VacationClass>('/vacation-classes/active');
    } catch {
      return getState().vacationClass.items.find((vc) => vc.status === 'active');
    }
  },

  async getReport(vacationClassId?: string): Promise<SchedulerReport | null> {
    if (vacationClassId) {
      try {
        return await http.get<SchedulerReport>(`/vacation-classes/${vacationClassId}/report`);
      } catch {
        return getState().vacationClass.items.find((vc) => vc.id === vacationClassId)?.lastReport as SchedulerReport | null || null;
      }
    }
    return lastReport;
  },

  async create(vc: Omit<VacationClass, 'id'>) {
    try {
      const created = await http.post<VacationClass>('/vacation-classes', vc);
      getDispatch()(addVacationClass(created));
      getDispatch()(addToast({ message: `Vacation class "${created.name}" created`, type: 'success' }));
      await delay();
    } catch {
      getDispatch()(addVacationClass(vc));
      getDispatch()(addToast({ message: `Vacation class "${vc.name}" created`, type: 'success' }));
      await delay();
    }
  },

  async updateStatus(vacationClassId: string, status: VacationClassStatus) {
    try {
      await http.patch(`/vacation-classes/${vacationClassId}/status`, { status });
      getDispatch()(updateVacationClassStatus({ id: vacationClassId, status }));
      getDispatch()(addToast({ message: `Status updated to ${status}`, type: 'success' }));
      await delay();
    } catch {
      getDispatch()(updateVacationClassStatus({ id: vacationClassId, status }));
      getDispatch()(addToast({ message: `Status updated to ${status}`, type: 'success' }));
      await delay();
    }
  },

  async delete(vacationClassId: string) {
    try {
      await http.delete(`/vacation-classes/${vacationClassId}`);
      getDispatch()(deleteVacationClass(vacationClassId));
      getDispatch()(addToast({ message: 'Vacation class deleted', type: 'info' }));
      await delay();
    } catch {
      getDispatch()(deleteVacationClass(vacationClassId));
      getDispatch()(addToast({ message: 'Vacation class deleted', type: 'info' }));
      await delay();
    }
  },

  async update(vc: VacationClass) {
    try {
      await http.patch(`/vacation-classes/${vc.id}`, vc);
      getDispatch()(updateVacationClass(vc));
      getDispatch()(addToast({ message: `Vacation class "${vc.name}" updated`, type: 'success' }));
      await delay();
    } catch {
      getDispatch()(updateVacationClass(vc));
      getDispatch()(addToast({ message: `Vacation class "${vc.name}" updated`, type: 'success' }));
      await delay();
    }
  },

  async updateAvailabilities(vacationClassId: string, availabilities: TeacherAvailability[]) {
    try {
      await http.patch(`/vacation-classes/${vacationClassId}/availability`, { availabilities });
      getDispatch()(updateTeacherAvailability({ vacationClassId, availabilities }));
      getDispatch()(addToast({ message: 'Teacher availability updated', type: 'success' }));
      await delay();
    } catch {
      getDispatch()(updateTeacherAvailability({ vacationClassId, availabilities }));
      getDispatch()(addToast({ message: 'Teacher availability updated', type: 'success' }));
      await delay();
    }
  },

  async updatePreferences(vacationClassId: string, preferences: TeacherSubjectPreference[]) {
    try {
      await http.patch(`/vacation-classes/${vacationClassId}/preferences`, { preferences });
      getDispatch()(updateTeacherSubjectPreferences({ vacationClassId, preferences }));
      getDispatch()(addToast({ message: 'Subject preferences updated', type: 'success' }));
      await delay();
    } catch {
      getDispatch()(updateTeacherSubjectPreferences({ vacationClassId, preferences }));
      getDispatch()(addToast({ message: 'Subject preferences updated', type: 'success' }));
      await delay();
    }
  },

  async generateTimetableForClass(vacationClassId: string) {
    try {
      const result = await http.post<{ timetableId: string; timetable: unknown; report: SchedulerReport; vacationClass: VacationClass }>(`/vacation-classes/${vacationClassId}/generate-timetable`, {});
      lastReport = result.report;
      getDispatch()(setVacationClassReport({ vacationClassId, report: result.report }));
      getDispatch()(setTimetableId({ vacationClassId, timetableId: result.timetableId }));
      getDispatch()(updateVacationClassStatus({ id: vacationClassId, status: 'active' }));
      const report = result.report;
      if (report.fulfillmentPercentage === 100) {
        getDispatch()(addToast({ message: `Timetable generated — all ${report.totalSubjectsRequired} subjects fully placed!`, type: 'success' }));
      } else {
        getDispatch()(addToast({
          message: `Timetable generated — ${report.fulfillmentPercentage}% fulfilled. ${report.warnings.length} issue(s).`,
          type: 'warning',
        }));
      }
      await delay(400);
      return { timetableId: result.timetableId, report };
    } catch {
      const state = getState();
      const vacationClass = state.vacationClass.items.find((vc) => vc.id === vacationClassId);
      if (!vacationClass) {
        getDispatch()(addToast({ message: 'Vacation class not found', type: 'error' }));
        return null;
      }

      const result = generateTimetable({
        vacationClass,
        subjects: state.subjects.items,
        programmes: state.programmes.items,
        teachers: state.teachers.items,
      });

      lastReport = result.report;
      getDispatch()(setVacationClassReport({ vacationClassId, report: result.report }));

      getDispatch()(deleteTimetablesForVacationClass(vacationClassId));

      const timetableId = nanoid();
      getDispatch()(addTimetable({
        id: timetableId,
        vacationClassId,
        slots: result.slots,
        generatedAt: new Date().toISOString(),
      }));
      getDispatch()(setTimetableId({ vacationClassId, timetableId }));
      getDispatch()(updateVacationClassStatus({ id: vacationClassId, status: 'active' }));

      const report = result.report;
      if (report.fulfillmentPercentage === 100) {
        getDispatch()(addToast({ message: `Timetable generated — all ${report.totalSubjectsRequired} subjects fully placed!`, type: 'success' }));
      } else {
        getDispatch()(addToast({
          message: `Timetable generated — ${report.fulfillmentPercentage}% fulfilled. ${report.warnings.length} issue(s).`,
          type: 'warning',
        }));
      }

      await delay(400);
      return { timetableId, report };
    }
  },
};

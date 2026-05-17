export type SubjectType = 'core' | 'elective';

export interface Subject {
  id: string;
  name: string;
  creditHours: number;
  type: SubjectType;
}

export interface Programme {
  id: string;
  name: string;
  electiveSubjectIds: string[];
  coreSubjectIds: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjectIds: string[];
}

export interface TeacherAvailability {
  teacherId: string;
  day: string;
  startHour: number;
  endHour: number;
}

export interface TeacherSubjectPreference {
  teacherId: string;
  subjectIds: string[];
}

export interface BreakPeriod {
  id: string;
  label: string;
  day: Day;
  startHour: number;
  endHour: number;
}

export type VacationClassStatus = 'draft' | 'active' | 'completed';

export interface VacationClass {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  selectedDays: Day[];
  breakPeriods: BreakPeriod[];
  dailyStartHour: number;
  dailyEndHour: number;
  programmeIds: string[];
  teacherIds: string[];
  teacherAvailabilities: TeacherAvailability[];
  teacherSubjectPreferences: TeacherSubjectPreference[];
  status: VacationClassStatus;
  timetableId: string | null;
  lastReport?: unknown;
}

export interface TimeSlot {
  id: string;
  day: string;
  startHour: number;
  endHour: number;
  subjectId: string;
  teacherId: string;
  programmeIds: string[];
  meetingLink?: string;
  status?: 'scheduled' | 'live' | 'completed';
}

export interface Timetable {
  id: string;
  vacationClassId: string;
  slots: TimeSlot[];
  generatedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  programmeId: string;
  vacationClassId: string;
}

export type UserRole = 'admin' | 'teacher' | 'student';

export interface AuthState {
  role: UserRole | null;
  userId: string | null;
  userName: string | null;
  isAuthenticated: boolean;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export type Day = (typeof DAYS)[number];

export const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

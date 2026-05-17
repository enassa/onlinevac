export const API_PREFIX = '/api';

export const COLLECTION_NAMES = {
  users: 'users',
  subjects: 'subjects',
  programmes: 'programmes',
  teachers: 'teachers',
  students: 'students',
  vacationClasses: 'vacationclasses',
  timetables: 'timetables',
};

export const USER_ROLES = Object.freeze({
  admin: 'admin',
  teacher: 'teacher',
  student: 'student',
});

export const SUBJECT_TYPES = Object.freeze({
  core: 'core',
  elective: 'elective',
});

export const VACATION_CLASS_STATUSES = Object.freeze({
  draft: 'draft',
  active: 'active',
  completed: 'completed',
});

export const TIME_SLOT_STATUSES = Object.freeze({
  scheduled: 'scheduled',
  live: 'live',
  completed: 'completed',
});

export const DAYS = Object.freeze(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
export const DEFAULT_SELECTED_DAYS = Object.freeze(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

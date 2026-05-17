import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { COLLECTION_NAMES, DAYS, VACATION_CLASS_STATUSES } from '../config/constants.js';

const teacherAvailabilitySchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true },
    day: { type: String, required: true, enum: DAYS },
    startHour: { type: Number, required: true, min: 0, max: 23 },
    endHour: { type: Number, required: true, min: 1, max: 24 },
  },
  { _id: false }
);

const teacherSubjectPreferenceSchema = new mongoose.Schema(
  {
    teacherId: { type: String, required: true },
    subjectIds: { type: [String], default: [] },
  },
  { _id: false }
);

const breakPeriodSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid() },
    label: { type: String, default: 'Break', trim: true },
    day: { type: String, required: true, enum: DAYS },
    startHour: { type: Number, required: true, min: 0, max: 23 },
    endHour: { type: Number, required: true, min: 1, max: 24 },
  },
  { _id: false }
);

const vacationClassSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid(), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    selectedDays: { type: [String], enum: DAYS, default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    breakPeriods: { type: [breakPeriodSchema], default: [] },
    dailyStartHour: { type: Number, required: true, min: 0, max: 23 },
    dailyEndHour: { type: Number, required: true, min: 1, max: 24 },
    programmeIds: { type: [String], default: [] },
    teacherIds: { type: [String], default: [] },
    teacherAvailabilities: { type: [teacherAvailabilitySchema], default: [] },
    teacherSubjectPreferences: { type: [teacherSubjectPreferenceSchema], default: [] },
    status: { type: String, enum: Object.values(VACATION_CLASS_STATUSES), default: VACATION_CLASS_STATUSES.draft },
    timetableId: { type: String, default: null },
    lastReport: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

vacationClassSchema.pre('validate', function validateVacationClass(next) {
  if (this.dailyEndHour <= this.dailyStartHour) {
    next(new Error('dailyEndHour must be greater than dailyStartHour'));
    return;
  }

  const invalidBreakPeriod = this.breakPeriods?.find((breakPeriod) => breakPeriod.endHour <= breakPeriod.startHour);
  if (invalidBreakPeriod) {
    next(new Error('Break period endHour must be greater than startHour'));
    return;
  }

  next();
});

export const VacationClass = mongoose.model('VacationClass', vacationClassSchema, COLLECTION_NAMES.vacationClasses);

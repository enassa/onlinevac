import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { COLLECTION_NAMES, DAYS, TIME_SLOT_STATUSES } from '../config/constants.js';

const timeSlotSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid() },
    day: { type: String, required: true, enum: DAYS },
    startHour: { type: Number, required: true, min: 0, max: 23 },
    endHour: { type: Number, required: true, min: 1, max: 24 },
    subjectId: { type: String, required: true },
    teacherId: { type: String, required: true },
    programmeIds: { type: [String], default: [] },
    meetingLink: { type: String, default: '' },
    status: { type: String, enum: Object.values(TIME_SLOT_STATUSES), default: TIME_SLOT_STATUSES.scheduled },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid(), unique: true, index: true },
    vacationClassId: { type: String, required: true, index: true },
    slots: { type: [timeSlotSchema], default: [] },
    generatedAt: { type: String, required: true },
  },
  { timestamps: true }
);

export const Timetable = mongoose.model('Timetable', timetableSchema, COLLECTION_NAMES.timetables);

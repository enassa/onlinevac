import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { COLLECTION_NAMES } from '../config/constants.js';

const studentSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid(), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    programmeId: { type: String, default: '' },
    vacationClassId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema, COLLECTION_NAMES.students);

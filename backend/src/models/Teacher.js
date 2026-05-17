import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { COLLECTION_NAMES } from '../config/constants.js';

const teacherSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid(), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    subjectIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model('Teacher', teacherSchema, COLLECTION_NAMES.teachers);

import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { COLLECTION_NAMES, SUBJECT_TYPES } from '../config/constants.js';

const subjectSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid(), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    creditHours: { type: Number, required: true, min: 1 },
    type: { type: String, required: true, enum: Object.values(SUBJECT_TYPES) },
  },
  { timestamps: true }
);

export const Subject = mongoose.model('Subject', subjectSchema, COLLECTION_NAMES.subjects);

import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { COLLECTION_NAMES } from '../config/constants.js';

const programmeSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid(), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    electiveSubjectIds: { type: [String], default: [] },
    coreSubjectIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Programme = mongoose.model('Programme', programmeSchema, COLLECTION_NAMES.programmes);

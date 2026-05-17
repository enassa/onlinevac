import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { COLLECTION_NAMES, USER_ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => nanoid(), unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(USER_ROLES) },
    linkedTeacherId: { type: String, default: '' },
    linkedStudentId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema, COLLECTION_NAMES.users);

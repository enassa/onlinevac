import { Student } from '../models/Student.js';
import { createCrudService } from './crud.service.js';
import { normalizeDocument } from '../utils/normalizeDocument.js';
import { createHttpError } from '../utils/createHttpError.js';

const crudService = createCrudService(Student, 'Student');

export const studentService = {
  ...crudService,

  async joinProgramme(studentId, programmeId) {
    const student = await Student.findOneAndUpdate({ id: studentId }, { programmeId }, { new: true, runValidators: true });
    if (!student) throw createHttpError(404, 'Student not found');
    return normalizeDocument(student);
  },
};

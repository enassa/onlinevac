import { Teacher } from '../models/Teacher.js';
import { createCrudService } from './crud.service.js';

export const teacherService = createCrudService(Teacher, 'Teacher');

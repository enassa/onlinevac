import { createCrudController } from './crud.controller.js';
import { teacherService } from '../services/teacher.service.js';

export const teacherController = createCrudController(teacherService, 'Teacher');

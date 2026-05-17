import { createCrudController } from './crud.controller.js';
import { subjectService } from '../services/subject.service.js';

export const subjectController = createCrudController(subjectService, 'Subject');

import { Subject } from '../models/Subject.js';
import { createCrudService } from './crud.service.js';

export const subjectService = createCrudService(Subject, 'Subject');

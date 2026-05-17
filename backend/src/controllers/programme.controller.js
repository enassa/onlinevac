import { createCrudController } from './crud.controller.js';
import { programmeService } from '../services/programme.service.js';

export const programmeController = createCrudController(programmeService, 'Programme');

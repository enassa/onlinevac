import { Programme } from '../models/Programme.js';
import { createCrudService } from './crud.service.js';

export const programmeService = createCrudService(Programme, 'Programme');

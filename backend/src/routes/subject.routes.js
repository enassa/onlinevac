import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { subjectController } from '../controllers/subject.controller.js';

export const subjectRoutes = Router();

subjectRoutes.get('/', asyncHandler(subjectController.getAll));
subjectRoutes.get('/:id', asyncHandler(subjectController.getById));
subjectRoutes.post('/', asyncHandler(subjectController.create));
subjectRoutes.patch('/:id', asyncHandler(subjectController.update));
subjectRoutes.delete('/:id', asyncHandler(subjectController.delete));

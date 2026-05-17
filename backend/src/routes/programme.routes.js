import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { programmeController } from '../controllers/programme.controller.js';

export const programmeRoutes = Router();

programmeRoutes.get('/', asyncHandler(programmeController.getAll));
programmeRoutes.get('/:id', asyncHandler(programmeController.getById));
programmeRoutes.post('/', asyncHandler(programmeController.create));
programmeRoutes.patch('/:id', asyncHandler(programmeController.update));
programmeRoutes.delete('/:id', asyncHandler(programmeController.delete));

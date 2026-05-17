import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { vacationClassController } from '../controllers/vacationClass.controller.js';

export const vacationClassRoutes = Router();

vacationClassRoutes.get('/', asyncHandler(vacationClassController.getAll));
vacationClassRoutes.get('/active', asyncHandler(vacationClassController.getActive));
vacationClassRoutes.get('/:id', asyncHandler(vacationClassController.getById));
vacationClassRoutes.get('/:id/report', asyncHandler(vacationClassController.getReport));
vacationClassRoutes.post('/', asyncHandler(vacationClassController.create));
vacationClassRoutes.post('/:id/generate-timetable', asyncHandler(vacationClassController.generateTimetableForClass));
vacationClassRoutes.patch('/:id', asyncHandler(vacationClassController.update));
vacationClassRoutes.patch('/:id/status', asyncHandler(vacationClassController.updateStatus));
vacationClassRoutes.patch('/:id/availability', asyncHandler(vacationClassController.updateAvailabilities));
vacationClassRoutes.patch('/:id/preferences', asyncHandler(vacationClassController.updatePreferences));
vacationClassRoutes.delete('/:id', asyncHandler(vacationClassController.delete));

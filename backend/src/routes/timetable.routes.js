import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { timetableController } from '../controllers/timetable.controller.js';

export const timetableRoutes = Router();

timetableRoutes.get('/', asyncHandler(timetableController.getAll));
timetableRoutes.get('/vacation-class/:vacationClassId', asyncHandler(timetableController.getByVacationClass));
timetableRoutes.get('/:id', asyncHandler(timetableController.getById));
timetableRoutes.patch('/:id/slots/:slotId', asyncHandler(timetableController.updateSlot));
timetableRoutes.delete('/vacation-class/:vacationClassId', asyncHandler(timetableController.deleteForVacationClass));
timetableRoutes.delete('/:id', asyncHandler(timetableController.delete));

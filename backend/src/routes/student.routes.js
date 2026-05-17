import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { studentController } from '../controllers/student.controller.js';

export const studentRoutes = Router();

studentRoutes.get('/', asyncHandler(studentController.getAll));
studentRoutes.get('/:id', asyncHandler(studentController.getById));
studentRoutes.post('/', asyncHandler(studentController.create));
studentRoutes.patch('/:id', asyncHandler(studentController.update));
studentRoutes.patch('/:id/programme', asyncHandler(studentController.joinProgramme));
studentRoutes.delete('/:id', asyncHandler(studentController.delete));

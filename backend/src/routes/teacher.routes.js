import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { teacherController } from '../controllers/teacher.controller.js';

export const teacherRoutes = Router();

teacherRoutes.get('/', asyncHandler(teacherController.getAll));
teacherRoutes.get('/:id', asyncHandler(teacherController.getById));
teacherRoutes.post('/', asyncHandler(teacherController.create));
teacherRoutes.patch('/:id', asyncHandler(teacherController.update));
teacherRoutes.delete('/:id', asyncHandler(teacherController.delete));

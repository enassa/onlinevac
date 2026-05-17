import { Router } from 'express';
import { bootstrapController } from '../controllers/bootstrap.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const bootstrapRoutes = Router();

bootstrapRoutes.put('/', asyncHandler(bootstrapController.replaceAll));

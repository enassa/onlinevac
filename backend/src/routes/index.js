import { Router } from 'express';
import { subjectRoutes } from './subject.routes.js';
import { programmeRoutes } from './programme.routes.js';
import { teacherRoutes } from './teacher.routes.js';
import { studentRoutes } from './student.routes.js';
import { vacationClassRoutes } from './vacationClass.routes.js';
import { timetableRoutes } from './timetable.routes.js';
import { bootstrapRoutes } from './bootstrap.routes.js';

export const routes = Router();

routes.get('/health', (request, response) => {
  response.json({ success: true, message: 'OnlineVac API is healthy' });
});

routes.use('/subjects', subjectRoutes);
routes.use('/programmes', programmeRoutes);
routes.use('/teachers', teacherRoutes);
routes.use('/students', studentRoutes);
routes.use('/vacation-classes', vacationClassRoutes);
routes.use('/timetables', timetableRoutes);
routes.use('/bootstrap', bootstrapRoutes);

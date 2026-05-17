import { createCrudController } from './crud.controller.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { vacationClassService } from '../services/vacationClass.service.js';

const crudController = createCrudController(vacationClassService, 'Vacation class');

export const vacationClassController = {
  ...crudController,

  async getActive(request, response) {
    const vacationClass = await vacationClassService.getActive();
    sendSuccess(response, vacationClass, 'Active vacation class retrieved');
  },

  async updateStatus(request, response) {
    const vacationClass = await vacationClassService.updateStatus(request.params.id, request.body.status);
    sendSuccess(response, vacationClass, 'Vacation class status updated');
  },

  async updateAvailabilities(request, response) {
    const vacationClass = await vacationClassService.updateAvailabilities(request.params.id, request.body.availabilities);
    sendSuccess(response, vacationClass, 'Teacher availability updated');
  },

  async updatePreferences(request, response) {
    const vacationClass = await vacationClassService.updatePreferences(request.params.id, request.body.preferences);
    sendSuccess(response, vacationClass, 'Teacher preferences updated');
  },

  async generateTimetableForClass(request, response) {
    const result = await vacationClassService.generateTimetableForClass(request.params.id);
    sendSuccess(response, result, 'Timetable generated');
  },

  async getReport(request, response) {
    const report = await vacationClassService.getReport(request.params.id);
    sendSuccess(response, report, 'Generation report retrieved');
  },
};

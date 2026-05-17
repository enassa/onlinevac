import { createCrudController } from './crud.controller.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { timetableService } from '../services/timetable.service.js';

const crudController = createCrudController(timetableService, 'Timetable');

export const timetableController = {
  ...crudController,

  async getByVacationClass(request, response) {
    const timetable = await timetableService.getByVacationClass(request.params.vacationClassId);
    sendSuccess(response, timetable, 'Timetable retrieved');
  },

  async deleteForVacationClass(request, response) {
    const result = await timetableService.deleteForVacationClass(request.params.vacationClassId);
    sendSuccess(response, result, 'Timetables deleted');
  },

  async updateSlot(request, response) {
    const timetable = await timetableService.updateSlot(request.params.id, request.params.slotId, request.body);
    sendSuccess(response, timetable, 'Time slot updated');
  },
};

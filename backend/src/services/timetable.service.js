import { Timetable } from '../models/Timetable.js';
import { createCrudService } from './crud.service.js';
import { normalizeDocument, normalizeDocuments } from '../utils/normalizeDocument.js';
import { createHttpError } from '../utils/createHttpError.js';

const crudService = createCrudService(Timetable, 'Timetable');

export const timetableService = {
  ...crudService,

  async getByVacationClass(vacationClassId) {
    const timetable = await Timetable.findOne({ vacationClassId });
    return normalizeDocument(timetable);
  },

  async deleteForVacationClass(vacationClassId) {
    await Timetable.deleteMany({ vacationClassId });
    return { vacationClassId };
  },

  async replaceForVacationClass(vacationClassId, slots) {
    await Timetable.deleteMany({ vacationClassId });
    const timetable = await Timetable.create({
      vacationClassId,
      slots,
      generatedAt: new Date().toISOString(),
    });
    return normalizeDocument(timetable);
  },

  async updateSlot(timetableId, slotId, patch) {
    const timetable = await Timetable.findOne({ id: timetableId });
    if (!timetable) throw createHttpError(404, 'Timetable not found');

    const slot = timetable.slots.find((item) => item.id === slotId);
    if (!slot) throw createHttpError(404, 'Time slot not found');

    Object.assign(slot, patch);
    await timetable.save();
    return normalizeDocument(timetable);
  },
};

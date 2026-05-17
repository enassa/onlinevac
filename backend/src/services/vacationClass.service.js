import { Programme } from '../models/Programme.js';
import { Subject } from '../models/Subject.js';
import { Teacher } from '../models/Teacher.js';
import { VacationClass } from '../models/VacationClass.js';
import { createCrudService } from './crud.service.js';
import { generateTimetable } from './scheduler.service.js';
import { timetableService } from './timetable.service.js';
import { normalizeDocument } from '../utils/normalizeDocument.js';
import { createHttpError } from '../utils/createHttpError.js';
import { VACATION_CLASS_STATUSES } from '../config/constants.js';

const crudService = createCrudService(VacationClass, 'Vacation class');

export const vacationClassService = {
  ...crudService,

  async getActive() {
    const vacationClass = await VacationClass.findOne({ status: VACATION_CLASS_STATUSES.active }).sort({ updatedAt: -1 });
    return normalizeDocument(vacationClass);
  },

  async updateStatus(id, status) {
    const vacationClass = await VacationClass.findOneAndUpdate({ id }, { status }, { new: true, runValidators: true });
    if (!vacationClass) throw createHttpError(404, 'Vacation class not found');
    return normalizeDocument(vacationClass);
  },

  async updateAvailabilities(id, teacherAvailabilities) {
    const vacationClass = await VacationClass.findOneAndUpdate({ id }, { teacherAvailabilities }, { new: true, runValidators: true });
    if (!vacationClass) throw createHttpError(404, 'Vacation class not found');
    return normalizeDocument(vacationClass);
  },

  async updatePreferences(id, teacherSubjectPreferences) {
    const vacationClass = await VacationClass.findOneAndUpdate({ id }, { teacherSubjectPreferences }, { new: true, runValidators: true });
    if (!vacationClass) throw createHttpError(404, 'Vacation class not found');
    return normalizeDocument(vacationClass);
  },

  async getReport(id) {
    const vacationClass = await VacationClass.findOne({ id });
    if (!vacationClass) throw createHttpError(404, 'Vacation class not found');
    return vacationClass.lastReport || null;
  },

  async generateTimetableForClass(id) {
    const vacationClassDocument = await VacationClass.findOne({ id });
    if (!vacationClassDocument) throw createHttpError(404, 'Vacation class not found');

    const [subjects, programmes, teachers] = await Promise.all([
      Subject.find(),
      Programme.find(),
      Teacher.find(),
    ]);

    const vacationClass = normalizeDocument(vacationClassDocument);
    const result = generateTimetable({
      vacationClass,
      subjects: subjects.map((subject) => normalizeDocument(subject)),
      programmes: programmes.map((programme) => normalizeDocument(programme)),
      teachers: teachers.map((teacher) => normalizeDocument(teacher)),
    });

    const timetable = await timetableService.replaceForVacationClass(id, result.slots);
    vacationClassDocument.lastReport = result.report;
    vacationClassDocument.timetableId = timetable.id;
    vacationClassDocument.status = VACATION_CLASS_STATUSES.active;
    await vacationClassDocument.save();

    return {
      timetableId: timetable.id,
      timetable,
      report: result.report,
      vacationClass: normalizeDocument(vacationClassDocument),
    };
  },
};

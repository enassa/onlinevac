import { Programme } from '../models/Programme.js';
import { Student } from '../models/Student.js';
import { Subject } from '../models/Subject.js';
import { Teacher } from '../models/Teacher.js';
import { Timetable } from '../models/Timetable.js';
import { VacationClass } from '../models/VacationClass.js';
import { normalizeDocuments } from '../utils/normalizeDocument.js';

export const bootstrapService = {
  async replaceAll(payload) {
    const subjects = payload.subjects ?? [];
    const programmes = payload.programmes ?? [];
    const teachers = payload.teachers ?? [];
    const students = payload.students ?? [];
    const vacationClasses = payload.vacationClasses ?? [];
    const timetables = payload.timetables ?? [];

    await Promise.all([
      Subject.deleteMany({}),
      Programme.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      VacationClass.deleteMany({}),
      Timetable.deleteMany({}),
    ]);

    const [createdSubjects, createdProgrammes, createdTeachers, createdStudents, createdVacationClasses, createdTimetables] = await Promise.all([
      subjects.length ? Subject.insertMany(subjects, { ordered: true }) : [],
      programmes.length ? Programme.insertMany(programmes, { ordered: true }) : [],
      teachers.length ? Teacher.insertMany(teachers, { ordered: true }) : [],
      students.length ? Student.insertMany(students, { ordered: true }) : [],
      vacationClasses.length ? VacationClass.insertMany(vacationClasses, { ordered: true }) : [],
      timetables.length ? Timetable.insertMany(timetables, { ordered: true }) : [],
    ]);

    return {
      subjects: normalizeDocuments(createdSubjects),
      programmes: normalizeDocuments(createdProgrammes),
      teachers: normalizeDocuments(createdTeachers),
      students: normalizeDocuments(createdStudents),
      vacationClasses: normalizeDocuments(createdVacationClasses),
      timetables: normalizeDocuments(createdTimetables),
    };
  },
};

import type { Subject, Programme, Teacher, VacationClass, Timetable, Student, TeacherAvailability, TeacherSubjectPreference } from '../types';

export const dummySubjects: Subject[] = [
  { id: 'sub-english', name: 'English Language', creditHours: 4, type: 'core' },
  { id: 'sub-core-math', name: 'Core Mathematics', creditHours: 4, type: 'core' },
  { id: 'sub-integrated-science', name: 'Integrated Science', creditHours: 3, type: 'core' },
  { id: 'sub-social-studies', name: 'Social Studies', creditHours: 3, type: 'core' },
  { id: 'sub-core-ict', name: 'ICT / Computing', creditHours: 2, type: 'core' },
  { id: 'sub-pe', name: 'Physical Education', creditHours: 1, type: 'core' },
  { id: 'sub-physics', name: 'Physics', creditHours: 3, type: 'elective' },
  { id: 'sub-chemistry', name: 'Chemistry', creditHours: 3, type: 'elective' },
  { id: 'sub-biology', name: 'Biology', creditHours: 3, type: 'elective' },
  { id: 'sub-elective-math', name: 'Elective Mathematics', creditHours: 3, type: 'elective' },
  { id: 'sub-computer-science', name: 'ICT / Computer Science', creditHours: 3, type: 'elective' },
  { id: 'sub-geography', name: 'Geography', creditHours: 3, type: 'elective' },
  { id: 'sub-government', name: 'Government', creditHours: 3, type: 'elective' },
  { id: 'sub-economics', name: 'Economics', creditHours: 3, type: 'elective' },
  { id: 'sub-history', name: 'History', creditHours: 3, type: 'elective' },
  { id: 'sub-literature', name: 'Literature in English', creditHours: 3, type: 'elective' },
  { id: 'sub-french', name: 'French', creditHours: 3, type: 'elective' },
  { id: 'sub-crs', name: 'Christian Religious Studies', creditHours: 3, type: 'elective' },
  { id: 'sub-irs', name: 'Islamic Religious Studies', creditHours: 3, type: 'elective' },
  { id: 'sub-ghanaian-language', name: 'Twi / Ghanaian Languages', creditHours: 3, type: 'elective' },
  { id: 'sub-financial-accounting', name: 'Financial Accounting', creditHours: 3, type: 'elective' },
  { id: 'sub-cost-accounting', name: 'Cost Accounting', creditHours: 3, type: 'elective' },
  { id: 'sub-business-management', name: 'Business Management', creditHours: 3, type: 'elective' },
  { id: 'sub-business-math', name: 'Business Mathematics', creditHours: 3, type: 'elective' },
  { id: 'sub-elective-ict', name: 'Elective ICT', creditHours: 3, type: 'elective' },
  { id: 'sub-gka', name: 'General Knowledge in Art', creditHours: 3, type: 'elective' },
  { id: 'sub-graphic-design', name: 'Graphic Design', creditHours: 3, type: 'elective' },
  { id: 'sub-picture-making', name: 'Picture Making', creditHours: 3, type: 'elective' },
  { id: 'sub-sculpture', name: 'Sculpture', creditHours: 3, type: 'elective' },
  { id: 'sub-ceramics', name: 'Ceramics', creditHours: 3, type: 'elective' },
  { id: 'sub-textiles', name: 'Textiles', creditHours: 3, type: 'elective' },
  { id: 'sub-leatherwork', name: 'Leatherwork', creditHours: 3, type: 'elective' },
  { id: 'sub-painting', name: 'Painting', creditHours: 3, type: 'elective' },
  { id: 'sub-food-nutrition', name: 'Food and Nutrition', creditHours: 3, type: 'elective' },
  { id: 'sub-management-living', name: 'Management in Living', creditHours: 3, type: 'elective' },
  { id: 'sub-clothing-textiles', name: 'Clothing and Textiles', creditHours: 3, type: 'elective' },
  { id: 'sub-general-agriculture', name: 'General Agriculture', creditHours: 3, type: 'elective' },
  { id: 'sub-animal-husbandry', name: 'Animal Husbandry', creditHours: 3, type: 'elective' },
  { id: 'sub-crop-science', name: 'Crop Science', creditHours: 3, type: 'elective' },
  { id: 'sub-horticulture', name: 'Horticulture', creditHours: 3, type: 'elective' },
  { id: 'sub-technical-drawing', name: 'Technical Drawing', creditHours: 3, type: 'elective' },
  { id: 'sub-building-construction', name: 'Building Construction', creditHours: 3, type: 'elective' },
  { id: 'sub-woodwork', name: 'Woodwork', creditHours: 3, type: 'elective' },
  { id: 'sub-metalwork', name: 'Metalwork', creditHours: 3, type: 'elective' },
  { id: 'sub-auto-mechanics', name: 'Auto Mechanics', creditHours: 3, type: 'elective' },
  { id: 'sub-electronics', name: 'Electronics', creditHours: 3, type: 'elective' },
];

const coreIds = dummySubjects.filter((sub) => sub.type === 'core').map((sub) => sub.id);

export const dummyProgrammes: Programme[] = [
  { id: 'prog-science', name: 'General Science', electiveSubjectIds: ['sub-physics', 'sub-chemistry', 'sub-biology', 'sub-elective-math', 'sub-computer-science', 'sub-geography'], coreSubjectIds: coreIds },
  { id: 'prog-arts', name: 'General Arts', electiveSubjectIds: ['sub-geography', 'sub-government', 'sub-economics', 'sub-history', 'sub-literature', 'sub-french', 'sub-crs', 'sub-irs', 'sub-ghanaian-language', 'sub-elective-math'], coreSubjectIds: coreIds },
  { id: 'prog-business', name: 'Business', electiveSubjectIds: ['sub-financial-accounting', 'sub-cost-accounting', 'sub-business-management', 'sub-economics', 'sub-elective-math', 'sub-business-math', 'sub-elective-ict'], coreSubjectIds: coreIds },
  { id: 'prog-visual-arts', name: 'Visual Arts', electiveSubjectIds: ['sub-gka', 'sub-graphic-design', 'sub-picture-making', 'sub-sculpture', 'sub-ceramics', 'sub-textiles', 'sub-leatherwork', 'sub-painting', 'sub-elective-ict', 'sub-elective-math'], coreSubjectIds: coreIds },
  { id: 'prog-home-economics', name: 'Home Economics', electiveSubjectIds: ['sub-food-nutrition', 'sub-management-living', 'sub-clothing-textiles', 'sub-biology', 'sub-economics', 'sub-gka', 'sub-french'], coreSubjectIds: coreIds },
  { id: 'prog-agriculture', name: 'Agricultural Science', electiveSubjectIds: ['sub-general-agriculture', 'sub-animal-husbandry', 'sub-crop-science', 'sub-horticulture', 'sub-chemistry', 'sub-physics', 'sub-elective-math'], coreSubjectIds: coreIds },
  { id: 'prog-technical', name: 'Technical / Technical Studies', electiveSubjectIds: ['sub-technical-drawing', 'sub-building-construction', 'sub-woodwork', 'sub-metalwork', 'sub-physics', 'sub-elective-math', 'sub-auto-mechanics', 'sub-electronics'], coreSubjectIds: coreIds },
];

export const dummyTeachers: Teacher[] = [
  { id: 'tch-1', name: 'Mr. Johnson', email: 'johnson@vacaclass.com', subjectIds: ['sub-english', 'sub-social-studies', 'sub-literature'] },
  { id: 'tch-2', name: 'Mrs. Adama', email: 'adama@vacaclass.com', subjectIds: ['sub-core-math', 'sub-elective-math', 'sub-business-math'] },
  { id: 'tch-3', name: 'Mr. Osei', email: 'osei@vacaclass.com', subjectIds: ['sub-integrated-science', 'sub-biology', 'sub-chemistry'] },
  { id: 'tch-4', name: 'Mrs. Mensah', email: 'mensah@vacaclass.com', subjectIds: ['sub-geography', 'sub-government', 'sub-history'] },
  { id: 'tch-5', name: 'Mr. Kufuor', email: 'kufuor@vacaclass.com', subjectIds: ['sub-physics', 'sub-electronics', 'sub-technical-drawing'] },
  { id: 'tch-6', name: 'Mrs. Asante', email: 'asante@vacaclass.com', subjectIds: ['sub-gka', 'sub-graphic-design', 'sub-picture-making', 'sub-sculpture', 'sub-ceramics', 'sub-textiles', 'sub-leatherwork', 'sub-painting'] },
  { id: 'tch-7', name: 'Mr. Tetteh', email: 'tetteh@vacaclass.com', subjectIds: ['sub-economics', 'sub-financial-accounting', 'sub-cost-accounting', 'sub-business-management'] },
  { id: 'tch-8', name: 'Mrs. Dzokoto', email: 'dzokoto@vacaclass.com', subjectIds: ['sub-core-ict', 'sub-computer-science', 'sub-elective-ict'] },
  { id: 'tch-9', name: 'Madam Owusu', email: 'owusu@vacaclass.com', subjectIds: ['sub-food-nutrition', 'sub-management-living', 'sub-clothing-textiles', 'sub-french'] },
  { id: 'tch-10', name: 'Mr. Baah', email: 'baah@vacaclass.com', subjectIds: ['sub-general-agriculture', 'sub-animal-husbandry', 'sub-crop-science', 'sub-horticulture'] },
  { id: 'tch-11', name: 'Mr. Annan', email: 'annan@vacaclass.com', subjectIds: ['sub-building-construction', 'sub-woodwork', 'sub-metalwork', 'sub-auto-mechanics'] },
  { id: 'tch-12', name: 'Mrs. Agyeman', email: 'agyeman@vacaclass.com', subjectIds: ['sub-pe', 'sub-crs', 'sub-irs', 'sub-ghanaian-language'] },
];

const defaultAvailabilities: TeacherAvailability[] = dummyTeachers.flatMap((teacher) =>
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => ({
    teacherId: teacher.id,
    day,
    startHour: 7,
    endHour: 18,
  }))
);

const defaultPreferences: TeacherSubjectPreference[] = dummyTeachers.map((teacher) => ({
  teacherId: teacher.id,
  subjectIds: [...teacher.subjectIds],
}));

export const dummyVacationClass: VacationClass = {
  id: 'vc-1',
  name: 'Summer 2025 Vacation Class',
  startDate: '2025-07-07',
  endDate: '2025-08-15',
  selectedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  breakPeriods: [
    { id: 'break-1', label: 'Break', day: 'Monday', startHour: 12, endHour: 13 },
    { id: 'break-2', label: 'Break', day: 'Tuesday', startHour: 12, endHour: 13 },
    { id: 'break-3', label: 'Break', day: 'Wednesday', startHour: 12, endHour: 13 },
    { id: 'break-4', label: 'Break', day: 'Thursday', startHour: 12, endHour: 13 },
    { id: 'break-5', label: 'Break', day: 'Friday', startHour: 12, endHour: 13 },
  ],
  dailyStartHour: 7,
  dailyEndHour: 18,
  programmeIds: dummyProgrammes.map((prog) => prog.id),
  teacherIds: dummyTeachers.map((tch) => tch.id),
  teacherAvailabilities: defaultAvailabilities,
  teacherSubjectPreferences: defaultPreferences,
  status: 'active',
  timetableId: 'tt-1',
};

export const dummyStudents: Student[] = [
  { id: 'stu-1', name: 'Kwame Asare', email: 'kwame@vacaclass.com', programmeId: 'prog-science', vacationClassId: 'vc-1' },
  { id: 'stu-2', name: 'Abena Boateng', email: 'abena@vacaclass.com', programmeId: 'prog-business', vacationClassId: 'vc-1' },
  { id: 'stu-3', name: 'Kofi Mensah', email: 'kofi@vacaclass.com', programmeId: 'prog-arts', vacationClassId: 'vc-1' },
  { id: 'stu-4', name: 'Ama Osei', email: 'ama@vacaclass.com', programmeId: 'prog-visual-arts', vacationClassId: 'vc-1' },
  { id: 'stu-5', name: 'Yaa Tetteh', email: 'yaa@vacaclass.com', programmeId: 'prog-home-economics', vacationClassId: 'vc-1' },
  { id: 'stu-6', name: 'Kweku Darko', email: 'kweku@vacaclass.com', programmeId: 'prog-agriculture', vacationClassId: 'vc-1' },
  { id: 'stu-7', name: 'Akosua Frimpong', email: 'akosua@vacaclass.com', programmeId: 'prog-technical', vacationClassId: 'vc-1' },
];

export const dummyTimetableSlots = generateDummySlots();

function generateDummySlots() {
  const slots: Timetable['slots'] = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let slotId = 1;

  const coreSubjects = dummySubjects.filter((sub) => sub.type === 'core');
  const allProgrammeIds = dummyProgrammes.map((prog) => prog.id);

  // Helper: count how many times a subject already appears on a given day
  const countSubjectOnDay = (subjectId: string, day: string) =>
    slots.filter((slot) => slot.subjectId === subjectId && slot.day === day).length;

  // Helper: count total slots on a day
  const dayLoad = (day: string) =>
    slots.filter((slot) => slot.day === day).length;

  // Helper: score a candidate slot (higher = better)
  const scoreCandidate = (subjectId: string, day: string, hour: number, programmeIds: string[]): number => {
    let score = 0;
    // Spread: strongly prefer days where this subject has 0 existing slots
    const existingOnDay = countSubjectOnDay(subjectId, day);
    if (existingOnDay === 0) score += 100;
    else if (existingOnDay === 1) score += 20;
    else score -= 50;
    // Day balance: prefer less-loaded days
    const maxLoad = Math.max(...days.map((dayItem) => dayLoad(dayItem)), 1);
    score += (maxLoad - dayLoad(day)) * 10;
    // Time preference: morning preferred
    if (hour >= 8 && hour <= 12) score += 5;
    else if (hour >= 13 && hour <= 15) score += 2;
    return score;
  };

  // Phase 1: Core subjects — spread credit hours across different days
  for (const coreSub of coreSubjects) {
    const hoursNeeded = coreSub.creditHours;
    let placed = 0;

    while (placed < hoursNeeded) {
      let bestDay = '';
      let bestHour = 8;
      let bestScore = -Infinity;

      for (const day of days) {
        for (let hour = 7; hour <= 17; hour++) {
          // No two cores at same cell
          const coreClash = slots.some(
            (slot) => slot.day === day && slot.startHour === hour && allProgrammeIds.some((pid) => slot.programmeIds.includes(pid))
          );
          if (coreClash) continue;

          const teacher = dummyTeachers.find((tch) => tch.subjectIds.includes(coreSub.id));
          if (!teacher) continue;
          const teacherBusy = slots.some(
            (slot) => slot.day === day && slot.startHour === hour && slot.teacherId === teacher.id
          );
          if (teacherBusy) continue;

          const score = scoreCandidate(coreSub.id, day, hour, allProgrammeIds);
          if (score > bestScore) {
            bestScore = score;
            bestDay = day;
            bestHour = hour;
          }
        }
      }

      if (bestScore === -Infinity) break; // no valid slot
      const teacher = dummyTeachers.find((tch) => tch.subjectIds.includes(coreSub.id))!;
      slots.push({
        id: `slot-${slotId++}`,
        day: bestDay,
        startHour: bestHour,
        endHour: bestHour + 1,
        subjectId: coreSub.id,
        teacherId: teacher.id,
        programmeIds: allProgrammeIds,
      });
      placed++;
    }
  }

  // Phase 2: Elective subjects — group shared electives across programmes
  // Shared electives are placed ONCE with all their programme IDs
  const electiveProgrammeMap = new Map<string, string[]>();
  for (const programme of dummyProgrammes) {
    for (const subId of programme.electiveSubjectIds) {
      const existing = electiveProgrammeMap.get(subId) || [];
      if (!existing.includes(programme.id)) {
        existing.push(programme.id);
      }
      electiveProgrammeMap.set(subId, existing);
    }
  }

  const electiveEntries = Array.from(electiveProgrammeMap.entries());
  electiveEntries.sort((entryA, entryB) => entryB[1].length - entryA[1].length);

  for (const [electiveId, programmeIds] of electiveEntries) {
    const elective = dummySubjects.find((sub) => sub.id === electiveId);
    if (!elective) continue;

    const hoursNeeded = elective.creditHours;
    let placed = 0;

    while (placed < hoursNeeded) {
      let bestDay = '';
      let bestHour = 8;
      let bestScore = -Infinity;

      for (const day of days) {
        for (let hour = 7; hour <= 17; hour++) {
          const programmeClash = programmeIds.some((pid) =>
            slots.some((slot) => slot.day === day && slot.startHour === hour && slot.programmeIds.includes(pid))
          );
          if (programmeClash) continue;

          const teacher = dummyTeachers.find((tch) => tch.subjectIds.includes(electiveId));
          if (!teacher) continue;
          const teacherBusy = slots.some(
            (slot) => slot.day === day && slot.startHour === hour && slot.teacherId === teacher.id
          );
          if (teacherBusy) continue;

          const score = scoreCandidate(electiveId, day, hour, programmeIds);
          if (score > bestScore) {
            bestScore = score;
            bestDay = day;
            bestHour = hour;
          }
        }
      }

      if (bestScore === -Infinity) break;
      const teacher = dummyTeachers.find((tch) => tch.subjectIds.includes(electiveId))!;
      slots.push({
        id: `slot-${slotId++}`,
        day: bestDay,
        startHour: bestHour,
        endHour: bestHour + 1,
        subjectId: electiveId,
        teacherId: teacher.id,
        programmeIds: programmeIds,
      });
      placed++;
    }
  }

  return slots;
}

export const dummyTimetable: Timetable = {
  id: 'tt-1',
  vacationClassId: 'vc-1',
  slots: dummyTimetableSlots,
  generatedAt: new Date().toISOString(),
};

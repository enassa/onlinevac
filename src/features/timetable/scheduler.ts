import { nanoid } from 'nanoid';
import type { Subject, Programme, Teacher, TeacherSubjectPreference, TimeSlot, VacationClass } from '../../types';
import { DAYS } from '../../types';

interface SchedulerInput {
  vacationClass: VacationClass;
  subjects: Subject[];
  programmes: Programme[];
  teachers: Teacher[];
}

interface PlacedSlot {
  day: string;
  hour: number;
  subjectId: string;
  teacherId: string;
  programmeIds: string[];
}

interface CandidateSlot {
  day: string;
  hour: number;
  teacher: Teacher;
  score: number;
}

interface SubjectRequirement {
  subjectId: string;
  programmeIds: string[];
  requiredHours: number;
  remainingHours: number;
}

// ── Report types ──────────────────────────────────────────────────

export interface SubjectReport {
  subjectId: string;
  subjectName: string;
  subjectType: 'core' | 'elective';
  requiredHours: number;
  placedHours: number;
  fulfilled: boolean;
  shortfall: number;
  programmeIds: string[];
  diagnostics: string[];
  recommendations: string[];
}

export interface ProgrammeReport {
  programmeId: string;
  programmeName: string;
  totalSubjects: number;
  representedSubjects: number;
  fullyFulfilled: number;
  partiallyFulfilled: number;
  missingSubjects: number;
}

export interface SchedulerReport {
  totalSubjectsRequired: number;
  totalSubjectsPlaced: number;
  totalSubjectsFullyFulfilled: number;
  totalSubjectsPartiallyFulfilled: number;
  totalSubjectsMissing: number;
  totalCreditHoursRequired: number;
  totalCreditHoursPlaced: number;
  fulfillmentPercentage: number;
  subjects: SubjectReport[];
  programmes: ProgrammeReport[];
  warnings: string[];
}

export interface SchedulerResult {
  slots: TimeSlot[];
  report: SchedulerReport;
}

export function generateTimetable(input: SchedulerInput): SchedulerResult {
  const { vacationClass, subjects, programmes, teachers } = input;
  const placed: PlacedSlot[] = [];

  const selectedProgrammes = programmes.filter((prog) => vacationClass.programmeIds.includes(prog.id));
  const selectedTeachers = teachers.filter((tch) => vacationClass.teacherIds.includes(tch.id));

  const selectedDays = vacationClass.selectedDays?.length
    ? vacationClass.selectedDays
    : DAYS.filter((day) => day !== 'Saturday');
  const usedDays = selectedDays.filter((day) =>
    vacationClass.teacherAvailabilities.some((avail) => avail.day === day)
  );
  const dailyStartHour = vacationClass.dailyStartHour ?? 7;
  const dailyEndHour = vacationClass.dailyEndHour ?? 18;

  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));
  const requirementMap = new Map<string, SubjectRequirement>();

  for (const programme of selectedProgrammes) {
    const programmeSubjectIds = [...programme.coreSubjectIds, ...programme.electiveSubjectIds];
    for (const subjectId of programmeSubjectIds) {
      const subject = subjectById.get(subjectId);
      if (!subject) continue;

      const existing = requirementMap.get(subjectId);
      if (existing) {
        if (!existing.programmeIds.includes(programme.id)) {
          existing.programmeIds.push(programme.id);
        }
      } else {
        requirementMap.set(subjectId, {
          subjectId,
          programmeIds: [programme.id],
          requiredHours: subject.creditHours,
          remainingHours: subject.creditHours,
        });
      }
    }
  }

  const requirements = Array.from(requirementMap.values());
  const diagnosticMap = new Map<string, { noTeacher: number; noAvailability: number; teacherBusy: number; coreBlocked: number; programmeBlocked: number; breakBlocked: number; noCandidate: number }>();

  const getDiagnostics = (subjectId: string) => {
    const existing = diagnosticMap.get(subjectId);
    if (existing) return existing;

    const emptyDiagnostics = {
      noTeacher: 0,
      noAvailability: 0,
      teacherBusy: 0,
      coreBlocked: 0,
      programmeBlocked: 0,
      breakBlocked: 0,
      noCandidate: 0,
    };
    diagnosticMap.set(subjectId, emptyDiagnostics);
    return emptyDiagnostics;
  };

  const isTeacherAvailable = (teacherId: string, day: string, hour: number): boolean => {
    const avail = vacationClass.teacherAvailabilities.find(
      (avail) => avail.teacherId === teacherId && avail.day === day
    );
    if (!avail) return false;
    return hour >= avail.startHour && hour < avail.endHour;
  };

  const isBreakPeriod = (day: string, hour: number): boolean => {
    return (vacationClass.breakPeriods ?? []).some((breakPeriod) =>
      breakPeriod.day === day && hour >= breakPeriod.startHour && hour < breakPeriod.endHour
    );
  };

  const isTeacherBusy = (teacherId: string, day: string, hour: number): boolean => {
    return placed.some((slot) => slot.teacherId === teacherId && slot.day === day && slot.hour === hour);
  };

  const getTeacherPreference = (teacherId: string): TeacherSubjectPreference | undefined => {
    return vacationClass.teacherSubjectPreferences.find((pref) => pref.teacherId === teacherId);
  };

  const getSubjectType = (subjectId: string): 'core' | 'elective' => {
    return subjectById.get(subjectId)?.type || 'elective';
  };

  const hasAnyCoreAtCell = (day: string, hour: number): boolean => {
    return placed.some((slot) => slot.day === day && slot.hour === hour && getSubjectType(slot.subjectId) === 'core');
  };

  const hasAnySlotAtCell = (day: string, hour: number): boolean => {
    return placed.some((slot) => slot.day === day && slot.hour === hour);
  };

  const hasProgrammeAtCell = (day: string, hour: number, programmeId: string): boolean => {
    return placed.some((slot) => {
      if (slot.day !== day || slot.hour !== hour) return false;
      return slot.programmeIds.includes(programmeId);
    });
  };

  const hasSameSubjectOnDay = (subjectId: string, day: string): number => {
    return placed.filter((slot) => slot.subjectId === subjectId && slot.day === day).length;
  };

  const slotsOnDayForProgramme = (day: string, programmeId: string): number => {
    return placed.filter((slot) => slot.programmeIds.includes(programmeId) && slot.day === day).length;
  };

  const dayLoad = (day: string): number => {
    return placed.filter((slot) => slot.day === day).length;
  };

  const teacherLoad = (teacherId: string): number => {
    return placed.filter((slot) => slot.teacherId === teacherId).length;
  };

  const findBestTeacher = (subjectId: string, day: string, hour: number): Teacher | null => {
    const preferredCandidates = selectedTeachers.filter((tch) => {
      if (!(tch.subjectIds ?? []).includes(subjectId)) return false;
      const pref = getTeacherPreference(tch.id);
      if (pref && !pref.subjectIds.includes(subjectId)) return false;
      if (!isTeacherAvailable(tch.id, day, hour)) return false;
      if (isTeacherBusy(tch.id, day, hour)) return false;
      return true;
    });

    if (preferredCandidates.length > 0) {
      preferredCandidates.sort((teacherA, teacherB) => teacherLoad(teacherA.id) - teacherLoad(teacherB.id));
      return preferredCandidates[0];
    }

    const fallbackCandidates = selectedTeachers.filter((tch) => {
      if (!(tch.subjectIds ?? []).includes(subjectId)) return false;
      if (!isTeacherAvailable(tch.id, day, hour)) return false;
      if (isTeacherBusy(tch.id, day, hour)) return false;
      return true;
    });

    if (fallbackCandidates.length > 0) {
      fallbackCandidates.sort((teacherA, teacherB) => teacherLoad(teacherA.id) - teacherLoad(teacherB.id));
      return fallbackCandidates[0];
    }

    return null;
  };

  const scoreSlot = (
    subjectId: string,
    day: string,
    hour: number,
    programmeIds: string[],
  ): number => {
    let score = 0;

    const existingOnDay = hasSameSubjectOnDay(subjectId, day);
    if (existingOnDay === 0) score += 100;
    else if (existingOnDay === 1) score += 20;
    else score -= 50;

    const maxDayLoad = Math.max(...usedDays.map((dayItem) => dayLoad(dayItem)), 1);
    const currentDayLoad = dayLoad(day);
    score += (maxDayLoad - currentDayLoad) * 10;

    for (const programmeId of programmeIds) {
      const progDayLoad = slotsOnDayForProgramme(day, programmeId);
      score -= progDayLoad * 5;
    }

    if (hour >= 8 && hour <= 12) score += 5;
    else if (hour >= 13 && hour <= 15) score += 2;
    else score += 0;

    return score;
  };

  const placeSlot = (day: string, hour: number, subjectId: string, teacherId: string, programmeIds: string[]) => {
    placed.push({ day, hour, subjectId, teacherId, programmeIds });
  };

  const findCandidates = (
    subjectId: string,
    programmeIds: string[],
  ): CandidateSlot[] => {
    const candidates: CandidateSlot[] = [];
    const subjectType = getSubjectType(subjectId);
    const diagnostics = getDiagnostics(subjectId);
    const eligibleTeachers = selectedTeachers.filter((teacher) => {
      if (!(teacher.subjectIds ?? []).includes(subjectId)) return false;
      const preference = getTeacherPreference(teacher.id);
      return !preference || preference.subjectIds.includes(subjectId);
    });

    if (eligibleTeachers.length === 0) {
      diagnostics.noTeacher++;
      return candidates;
    }

    for (const day of usedDays) {
      for (let hour = dailyStartHour; hour < dailyEndHour; hour++) {
        if (isBreakPeriod(day, hour)) {
          diagnostics.breakBlocked++;
          continue;
        }
        if (subjectType === 'core' && hasAnySlotAtCell(day, hour)) {
          diagnostics.coreBlocked++;
          continue;
        }
        if (subjectType === 'elective' && hasAnyCoreAtCell(day, hour)) {
          diagnostics.coreBlocked++;
          continue;
        }
        if (programmeIds.some((programmeId) => hasProgrammeAtCell(day, hour, programmeId))) {
          diagnostics.programmeBlocked++;
          continue;
        }

        const availableTeachers = eligibleTeachers.filter((teacher) => isTeacherAvailable(teacher.id, day, hour));
        if (availableTeachers.length === 0) {
          diagnostics.noAvailability++;
          continue;
        }

        if (availableTeachers.every((teacher) => isTeacherBusy(teacher.id, day, hour))) {
          diagnostics.teacherBusy++;
          continue;
        }

        const teacher = findBestTeacher(subjectId, day, hour);
        if (!teacher) continue;

        const score = scoreSlot(subjectId, day, hour, programmeIds);
        candidates.push({ day, hour, teacher, score });
      }
    }

    candidates.sort((slotA, slotB) => slotB.score - slotA.score);
    if (candidates.length === 0) diagnostics.noCandidate++;
    return candidates;
  };

  let madeProgress = true;
  while (madeProgress && requirements.some((requirement) => requirement.remainingHours > 0)) {
    madeProgress = false;

    const pendingRequirements = requirements
      .filter((requirement) => requirement.remainingHours > 0)
      .sort((requirementA, requirementB) => {
        const teachersForA = selectedTeachers.filter((teacher) => (teacher.subjectIds ?? []).includes(requirementA.subjectId)).length;
        const teachersForB = selectedTeachers.filter((teacher) => (teacher.subjectIds ?? []).includes(requirementB.subjectId)).length;
        if (teachersForA !== teachersForB) return teachersForA - teachersForB;
        if (requirementA.programmeIds.length !== requirementB.programmeIds.length) {
          return requirementB.programmeIds.length - requirementA.programmeIds.length;
        }
        return requirementB.remainingHours - requirementA.remainingHours;
      });

    for (const requirement of pendingRequirements) {
      const candidates = findCandidates(requirement.subjectId, requirement.programmeIds);
      if (candidates.length === 0) continue;

      const best = candidates[0];
      placeSlot(best.day, best.hour, requirement.subjectId, best.teacher.id, requirement.programmeIds);
      requirement.remainingHours--;
      madeProgress = true;
    }
  }

  const slots: TimeSlot[] = placed.map((slot) => ({
    id: nanoid(),
    day: slot.day,
    startHour: slot.hour,
    endHour: slot.hour + 1,
    subjectId: slot.subjectId,
    teacherId: slot.teacherId,
    programmeIds: slot.programmeIds,
  }));

  // ── Generate validation report ──────────────────────────────────

  const report = buildReport(placed, subjects, selectedProgrammes, diagnosticMap);

  return { slots, report };
}

function buildReport(
  placed: PlacedSlot[],
  subjects: Subject[],
  programmes: Programme[],
  diagnosticMap: Map<string, { noTeacher: number; noAvailability: number; teacherBusy: number; coreBlocked: number; programmeBlocked: number; breakBlocked: number; noCandidate: number }>,
): SchedulerReport {
  const warnings: string[] = [];
  const subjectReports: SubjectReport[] = [];

  // Gather all unique subjects that should appear across all programmes
  const requiredSubjectIds = new Set<string>();
  for (const programme of programmes) {
    for (const subId of programme.coreSubjectIds) requiredSubjectIds.add(subId);
    for (const subId of programme.electiveSubjectIds) requiredSubjectIds.add(subId);
  }

  let totalCreditHoursRequired = 0;
  let totalCreditHoursPlaced = 0;
  let totalSubjectsFullyFulfilled = 0;
  let totalSubjectsPartiallyFulfilled = 0;
  let totalSubjectsMissing = 0;

  for (const subjectId of requiredSubjectIds) {
    const subject = subjects.find((sub) => sub.id === subjectId);
    if (!subject) continue;

    const requiredHours = subject.creditHours;
    const placedSlots = placed.filter((slot) => slot.subjectId === subjectId);
    const placedHours = placedSlots.length;
    const fulfilled = placedHours === requiredHours;
    const shortfall = Math.max(0, requiredHours - placedHours);
    const overplaced = Math.max(0, placedHours - requiredHours);

    // Determine which programmes this subject belongs to
    const programmeIds = programmes
      .filter((prog) => prog.coreSubjectIds.includes(subjectId) || prog.electiveSubjectIds.includes(subjectId))
      .map((prog) => prog.id);
    const diagnostics = buildSubjectDiagnostics(diagnosticMap.get(subjectId));
    const recommendations = buildSubjectRecommendations(diagnosticMap.get(subjectId), subject.type);

    totalCreditHoursRequired += requiredHours;
    totalCreditHoursPlaced += Math.min(placedHours, requiredHours); // Don't count over-placement

    if (fulfilled) {
      totalSubjectsFullyFulfilled++;
    } else if (overplaced > 0) {
      // Over-placed: more slots than credit hours — still an issue
      totalSubjectsPartiallyFulfilled++;
      warnings.push(
        `${subject.name} (${subject.type}): needs ${requiredHours}h, got ${placedHours}h — ${overplaced}h over-placed`
      );
    } else if (placedHours > 0) {
      totalSubjectsPartiallyFulfilled++;
      warnings.push(
        `${subject.name} (${subject.type}): needs ${requiredHours}h, got ${placedHours}h — ${shortfall}h short`
      );
    } else {
      totalSubjectsMissing++;
      warnings.push(
        `${subject.name} (${subject.type}): needs ${requiredHours}h, got 0h — completely unplaced`
      );
    }

    subjectReports.push({
      subjectId,
      subjectName: subject.name,
      subjectType: subject.type,
      requiredHours,
      placedHours,
      fulfilled,
      shortfall,
      programmeIds,
      diagnostics,
      recommendations,
    });
  }

  // Sort: issues first (over-placed, missing, partial), then fulfilled
  subjectReports.sort((reportA, reportB) => {
    const hasIssueA = reportA.shortfall > 0 || reportA.placedHours > reportA.requiredHours;
    const hasIssueB = reportB.shortfall > 0 || reportB.placedHours > reportB.requiredHours;
    if (hasIssueA && !hasIssueB) return -1;
    if (!hasIssueA && hasIssueB) return 1;
    return reportB.shortfall - reportA.shortfall;
  });

  // Programme-level reports
  const programmeReports: ProgrammeReport[] = programmes.map((programme) => {
    const allSubjectIds = [...programme.coreSubjectIds, ...programme.electiveSubjectIds];
    const programmeSubjectReports = subjectReports.filter((reportItem) =>
      reportItem.programmeIds.includes(programme.id)
    );

    const representedSubjects = programmeSubjectReports.filter((reportItem) => reportItem.placedHours > 0).length;
    const fullyFulfilled = programmeSubjectReports.filter((reportItem) => reportItem.fulfilled).length;
    const partiallyFulfilled = programmeSubjectReports.filter((reportItem) => !reportItem.fulfilled && reportItem.placedHours > 0).length;
    const missingSubjects = allSubjectIds.length - representedSubjects;

    if (missingSubjects > 0) {
      warnings.push(
        `Programme "${programme.name}": ${missingSubjects} of ${allSubjectIds.length} subjects have no slots at all`
      );
    }

    return {
      programmeId: programme.id,
      programmeName: programme.name,
      totalSubjects: allSubjectIds.length,
      representedSubjects,
      fullyFulfilled,
      partiallyFulfilled,
      missingSubjects,
    };
  });

  const totalSubjectsRequired = requiredSubjectIds.size;
  const totalSubjectsPlaced = totalSubjectsFullyFulfilled + totalSubjectsPartiallyFulfilled;
  const fulfillmentPercentage = totalCreditHoursRequired > 0
    ? Math.round((totalCreditHoursPlaced / totalCreditHoursRequired) * 100)
    : 0;

  return {
    totalSubjectsRequired,
    totalSubjectsPlaced,
    totalSubjectsFullyFulfilled,
    totalSubjectsPartiallyFulfilled,
    totalSubjectsMissing,
    totalCreditHoursRequired,
    totalCreditHoursPlaced,
    fulfillmentPercentage,
    subjects: subjectReports,
    programmes: programmeReports,
    warnings,
  };
}

function buildSubjectDiagnostics(diagnostics?: { noTeacher: number; noAvailability: number; teacherBusy: number; coreBlocked: number; programmeBlocked: number; breakBlocked: number; noCandidate: number }): string[] {
  if (!diagnostics) return [];

  const messages: string[] = [];
  if (diagnostics.noTeacher > 0) messages.push('No selected teacher is eligible or willing to teach this subject.');
  if (diagnostics.noAvailability > 0) messages.push('Eligible teachers were not available in many open periods.');
  if (diagnostics.teacherBusy > 0) messages.push('Eligible teachers were already assigned to another session in available periods.');
  if (diagnostics.coreBlocked > 0) messages.push('Available periods were blocked by core-subject timetable rules.');
  if (diagnostics.programmeBlocked > 0) messages.push('Available periods clashed with another subject for the same programme.');
  if (diagnostics.breakBlocked > 0) messages.push('Some otherwise possible periods were reserved as vacation class breaks.');
  if (diagnostics.noCandidate > 0 && messages.length === 0) messages.push('No legal timetable position remained after applying all constraints.');
  return messages;
}

function buildSubjectRecommendations(
  diagnostics: { noTeacher: number; noAvailability: number; teacherBusy: number; coreBlocked: number; programmeBlocked: number; breakBlocked: number; noCandidate: number } | undefined,
  subjectType: 'core' | 'elective',
): string[] {
  if (!diagnostics) return [];

  const recommendations: string[] = [];
  if (diagnostics.noTeacher > 0) recommendations.push('Assign at least one selected teacher to this subject or enable it in teacher preferences.');
  if (diagnostics.noAvailability > 0) recommendations.push('Extend teacher availability or the vacation class daily teaching window.');
  if (diagnostics.teacherBusy > 0) recommendations.push('Add another teacher for this subject or reduce conflicting teacher assignments.');
  if (diagnostics.coreBlocked > 0 && subjectType === 'core') recommendations.push('Increase the daily window because core subjects cannot run beside any other class.');
  if (diagnostics.coreBlocked > 0 && subjectType === 'elective') recommendations.push('Move capacity away from core-heavy periods by extending hours or adding available days.');
  if (diagnostics.programmeBlocked > 0) recommendations.push('Add more timetable capacity because electives in the same programme cannot run together.');
  if (diagnostics.breakBlocked > 0) recommendations.push('Review break periods or increase teaching hours if breaks reduce too much capacity.');
  if (diagnostics.noCandidate > 0 && recommendations.length === 0) recommendations.push('Increase available periods, selected teachers, or programme capacity and regenerate.');
  return recommendations;
}

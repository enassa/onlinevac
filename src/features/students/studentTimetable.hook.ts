import { useAppSelector } from '../../app/hooks';

export function useStudentTimetable() {
  const auth = useAppSelector((state) => state.auth);
  const students = useAppSelector((state) => state.students.items);
  const programmes = useAppSelector((state) => state.programmes.items);
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const timetables = useAppSelector((state) => state.timetable.items);
  const subjects = useAppSelector((state) => state.subjects.items);
  const teachers = useAppSelector((state) => state.teachers.items);

  const student = students.find((s) => s.id === auth.userId);
  const programme = student?.programmeId ? programmes.find((p) => p.id === student.programmeId) : null;
  const activeClass = vacationClasses.find((vc) => vc.status === 'active');
  const timetable = activeClass ? timetables.find((tt) => tt.vacationClassId === activeClass.id) : undefined;

  const mySubjectIds = programme ? [...programme.coreSubjectIds, ...programme.electiveSubjectIds] : [];
  const mySlots = timetable?.slots.filter((slot) =>
    slot.programmeIds.some((pid) => pid === student?.programmeId) && mySubjectIds.includes(slot.subjectId)
  ) || [];

  const getSubjectName = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.name || 'Unknown';
  const getSubjectType = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.type || 'elective';
  const getTeacherName = (teacherId: string) => teachers.find((t) => t.id === teacherId)?.name || 'Unknown';
  const getSlotForCell = (day: string, hour: number) => mySlots.find((slot) => slot.day === day && slot.startHour === hour) || null;
  const timetableHours = activeClass
    ? Array.from(
      { length: Math.max(0, activeClass.dailyEndHour - activeClass.dailyStartHour) },
      (_, hourIndex) => activeClass.dailyStartHour + hourIndex,
    )
    : [];

  return { programme, mySlots, getSubjectName, getSubjectType, getTeacherName, getSlotForCell, activeClass, timetableHours };
}

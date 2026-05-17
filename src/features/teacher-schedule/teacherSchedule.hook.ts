import { useAppSelector } from '../../app/hooks';

export function useTeacherSchedule() {
  const auth = useAppSelector((state) => state.auth);
  const teachers = useAppSelector((state) => state.teachers.items);
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const timetables = useAppSelector((state) => state.timetable.items);
  const subjects = useAppSelector((state) => state.subjects.items);

  const teacher = teachers.find((t) => t.id === auth.userId);
  const activeClass = vacationClasses.find((vc) => vc.status === 'active');
  const timetable = activeClass ? timetables.find((tt) => tt.vacationClassId === activeClass.id) : undefined;

  const mySlots = timetable?.slots.filter((slot) => slot.teacherId === auth.userId) || [];

  const getSubjectName = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.name || 'Unknown';
  const getSlotForCell = (day: string, hour: number) => mySlots.find((slot) => slot.day === day && slot.startHour === hour) || null;

  const totalHours = mySlots.length;
  const uniqueSubjects = [...new Set(mySlots.map((slot) => slot.subjectId))];

  const timetableHours = activeClass
    ? Array.from(
      { length: Math.max(0, activeClass.dailyEndHour - activeClass.dailyStartHour) },
      (_, hourIndex) => activeClass.dailyStartHour + hourIndex,
    )
    : [];

  return { teacher, mySlots, getSubjectName, getSlotForCell, totalHours, uniqueSubjects, activeClass, timetableHours };
}

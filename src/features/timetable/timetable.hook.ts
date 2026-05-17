import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { timetablesApi, vacationClassApi } from '../../api';

export function useTimetable() {
  const { id } = useParams<{ id: string }>();
  const vacationClass = useAppSelector((state) => state.vacationClass.items.find((vc) => vc.id === id));
  const timetable = useAppSelector((state) => state.timetable.items.find((tt) => tt.vacationClassId === id));
  const subjects = useAppSelector((state) => state.subjects.items);
  const teachers = useAppSelector((state) => state.teachers.items);
  const programmes = useAppSelector((state) => state.programmes.items);

  const getSubjectName = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.name || 'Unknown';
  const getSubjectType = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.type || 'elective';
  const getTeacherName = (teacherId: string) => teachers.find((teacher) => teacher.id === teacherId)?.name || 'Unknown';
  const getProgrammeNames = (programmeIds: string[]) => programmeIds.map((pid) => programmes.find((prog) => prog.id === pid)?.name || '').filter(Boolean);

  const getSlotsForCell = (day: string, hour: number) => {
    if (!timetable) return [];
    return timetable.slots.filter((slot) => slot.day === day && slot.startHour === hour);
  };

  return {
    vacationClass, timetable, getSubjectName, getSubjectType, getTeacherName,
    getProgrammeNames, getSlotsForCell, id,
  };
}

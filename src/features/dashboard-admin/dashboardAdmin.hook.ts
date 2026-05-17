import { useAppSelector } from '../../app/hooks';

export function useDashboardAdmin() {
  const subjects = useAppSelector((state) => state.subjects.items);
  const programmes = useAppSelector((state) => state.programmes.items);
  const teachers = useAppSelector((state) => state.teachers.items);
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const students = useAppSelector((state) => state.students.items);

  const activeClasses = vacationClasses.filter((vc) => vc.status === 'active').length;
  const coreCount = subjects.filter((sub) => sub.type === 'core').length;
  const electiveCount = subjects.filter((sub) => sub.type === 'elective').length;

  return { subjects, programmes, teachers, vacationClasses, students, activeClasses, coreCount, electiveCount };
}

import { useAppSelector } from '../../app/hooks';
import { studentsApi, programmesApi } from '../../api';

export function useStudentJoin() {
  const auth = useAppSelector((state) => state.auth);
  const student = studentsApi.getById(auth.userId || '');
  const joinedProgramme = student?.programmeId ? programmesApi.getById(student.programmeId) : null;
  const programmes = useAppSelector((state) => state.programmes.items);

  const handleJoin = async (programmeId: string) => {
    if (!student) return;
    await studentsApi.joinProgramme(student.id, programmeId);
  };

  return { student, programmes, joinedProgramme, handleJoin };
}

import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { programmesApi, subjectsApi } from '../../api';
import type { Programme } from '../../types';

export function useProgrammes() {
  const programmes = useAppSelector((state) => state.programmes.items);
  const subjects = useAppSelector((state) => state.subjects.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<Programme | null>(null);

  const openCreate = () => { setEditingProgramme(null); setIsModalOpen(true); };
  const openEdit = (programmeId: string) => {
    const programme = programmes.find((programmeItem: Programme) => programmeItem.id === programmeId);
    if (!programme) return;
    setEditingProgramme({
      ...programme,
      coreSubjectIds: programme.coreSubjectIds ?? [],
      electiveSubjectIds: programme.electiveSubjectIds ?? [],
    });
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingProgramme(null); };

  const handleCreate = async (data: Omit<Programme, 'id'>) => {
    await programmesApi.create(data);
    closeModal();
  };

  const handleEdit = async (data: Programme) => {
    await programmesApi.update(data);
    closeModal();
  };

  const handleDelete = async (programmeId: string) => {
    await programmesApi.delete(programmeId);
  };

  const getSubjectName = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.name || 'Unknown';

  const electiveSubjects = subjects.filter((sub) => sub.type === 'elective');

  return {
    programmes, subjects, electiveSubjects, isModalOpen, editingProgramme,
    openCreate, openEdit, closeModal, handleCreate, handleEdit, handleDelete,
    getSubjectName,
  };
}

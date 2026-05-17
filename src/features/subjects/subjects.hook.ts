import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { subjectsApi } from '../../api';
import type { Subject, SubjectType } from '../../types';

export function useSubjects() {
  const subjects = useAppSelector((state) => state.subjects.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const openCreate = () => { setEditingSubject(null); setIsModalOpen(true); };
  const openEdit = (subject: Subject) => { setEditingSubject(subject); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingSubject(null); };

  const handleCreate = async (data: Omit<Subject, 'id'>) => {
    await subjectsApi.create(data);
    closeModal();
  };

  const handleEdit = async (data: Subject) => {
    await subjectsApi.update(data);
    closeModal();
  };

  const handleDelete = async (subjectId: string) => {
    await subjectsApi.delete(subjectId);
  };

  const coreSubjects = subjects.filter((sub) => sub.type === 'core');
  const electiveSubjects = subjects.filter((sub) => sub.type === 'elective');

  return {
    subjects, coreSubjects, electiveSubjects, isModalOpen, editingSubject,
    openCreate, openEdit, closeModal, handleCreate, handleEdit, handleDelete,
  };
}

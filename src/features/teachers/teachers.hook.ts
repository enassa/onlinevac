import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { teachersApi, subjectsApi } from '../../api';
import type { Teacher, TeacherAvailability, TimeSlot, Timetable, VacationClass } from '../../types';

interface TeacherAvailabilitySummary {
  vacationClassName: string;
  day: string;
  startHour: number;
  endHour: number;
}

interface TeacherScheduleSummary {
  vacationClassName: string;
  day: string;
  startHour: number;
  endHour: number;
  subjectName: string;
}

export function useTeachers() {
  const teachers = useAppSelector((state) => state.teachers.items);
  const subjects = useAppSelector((state) => state.subjects.items);
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const timetables = useAppSelector((state) => state.timetable.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const openCreate = () => { setEditingTeacher(null); setIsModalOpen(true); };
  const openEdit = (teacherId: string) => {
    const teacher = teachers.find((teacherItem: Teacher) => teacherItem.id === teacherId);
    if (!teacher) return;
    setEditingTeacher({ ...teacher, subjectIds: teacher.subjectIds ?? [] });
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingTeacher(null); };

  const handleCreate = async (data: Omit<Teacher, 'id'>) => {
    await teachersApi.create(data);
    closeModal();
  };

  const handleEdit = async (data: Teacher) => {
    await teachersApi.update(data);
    closeModal();
  };

  const handleDelete = async (teacherId: string) => {
    await teachersApi.delete(teacherId);
  };

  const getSubjectName = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.name || 'Unknown';
  const getSubjectType = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.type || 'elective';
  const getTeacherAvailability = (teacherId: string): TeacherAvailabilitySummary[] => vacationClasses.flatMap((vacationClass: VacationClass) =>
    vacationClass.teacherAvailabilities
      .filter((availability: TeacherAvailability) => availability.teacherId === teacherId)
      .map((availability: TeacherAvailability) => ({
        vacationClassName: vacationClass.name,
        day: availability.day,
        startHour: availability.startHour,
        endHour: availability.endHour,
      }))
  );
  const getTeacherSchedule = (teacherId: string): TeacherScheduleSummary[] => timetables.flatMap((timetable: Timetable) => {
    const vacationClass = vacationClasses.find((item: VacationClass) => item.id === timetable.vacationClassId);
    return timetable.slots
      .filter((slot: TimeSlot) => slot.teacherId === teacherId)
      .map((slot: TimeSlot) => ({
        vacationClassName: vacationClass?.name || 'Unknown class',
        day: slot.day,
        startHour: slot.startHour,
        endHour: slot.endHour,
        subjectName: getSubjectName(slot.subjectId),
      }));
  });

  return {
    teachers, subjects, isModalOpen, editingTeacher,
    openCreate, openEdit, closeModal, handleCreate, handleEdit, handleDelete,
    getSubjectName, getSubjectType, getTeacherAvailability, getTeacherSchedule,
  };
}

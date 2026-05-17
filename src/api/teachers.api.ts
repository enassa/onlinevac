import { http } from '../utils/httpClient';
import { getDispatch } from './storeRef';
import { addTeacher, updateTeacher, deleteTeacher } from '../features/teachers/teachers.slice';
import { addToast } from '../features/toast/toast.slice';
import type { Teacher } from '../types';

function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const teachersApi = {
  async getAll(): Promise<Teacher[]> {
    try {
      return await http.get<Teacher[]>('/teachers');
    } catch {
      const { dummyTeachers } = await import('../data/dummyData');
      return dummyTeachers;
    }
  },

  async getById(id: string): Promise<Teacher | undefined> {
    try {
      return await http.get<Teacher>(`/teachers/${id}`);
    } catch {
      const { dummyTeachers } = await import('../data/dummyData');
      return dummyTeachers.find((item: Teacher) => item.id === id);
    }
  },

  async create(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
    const created = await http.post<Teacher>('/teachers', teacher);
    getDispatch()(addTeacher(created));
    getDispatch()(addToast({ message: `Teacher "${created.name}" created`, type: 'success' }));
    await delay();
    return created;
  },

  async update(teacher: Teacher): Promise<void> {
    await http.patch(`/teachers/${teacher.id}`, teacher);
    getDispatch()(updateTeacher(teacher));
    getDispatch()(addToast({ message: `Teacher "${teacher.name}" updated`, type: 'success' }));
    await delay();
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/teachers/${id}`);
    getDispatch()(deleteTeacher(id));
    const teacher = await teachersApi.getById(id);
    getDispatch()(addToast({ message: `Teacher "${teacher?.name}" deleted`, type: 'info' }));
    await delay();
  },
};

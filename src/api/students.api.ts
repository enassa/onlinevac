import { http } from '../utils/httpClient';
import { getDispatch, getState } from './storeRef';
import { addStudent, updateStudent, deleteStudent, joinProgramme } from '../features/students/students.slice';
import type { Student } from '../types';

export const studentsApi = {
  async getAll(): Promise<Student[]> {
    try {
      return await http.get<Student[]>('/students');
    } catch {
      const { dummyStudents } = await import('../data/dummyData');
      return dummyStudents;
    }
  },

  async getById(id: string): Promise<Student | undefined> {
    try {
      return await http.get<Student>(`/students/${id}`);
    } catch {
      const { dummyStudents } = await import('../data/dummyData');
      return dummyStudents.find((item: Student) => item.id === id);
    }
  },

  async getProgrammeForStudent(studentId: string) {
    const student = await this.getById(studentId);
    if (!student || !student.programmeId) return null;
    const { programmesApi } = await import('./programmes.api');
    return await programmesApi.getById(student.programmeId);
  },

  async create(student: Omit<Student, 'id'>): Promise<Student> {
    const created = await http.post<Student>('/students', student);
    getDispatch()(addStudent(created));
    return created;
  },

  async update(student: Student): Promise<void> {
    await http.patch(`/students/${student.id}`, student);
    getDispatch()(updateStudent(student));
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/students/${id}`);
    getDispatch()(deleteStudent(id));
  },

  async joinProgramme(studentId: string, programmeId: string): Promise<void> {
    await http.patch(`/students/${studentId}/programme`, { programmeId });
    getDispatch()(joinProgramme({ studentId, programmeId }));
  },
};

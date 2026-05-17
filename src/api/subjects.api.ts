import { http } from '../utils/httpClient';
import { getDispatch } from './storeRef';
import { addSubject, updateSubject, deleteSubject } from '../features/subjects/subjects.slice';
import { addToast } from '../features/toast/toast.slice';
import type { Subject } from '../types';

function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const subjectsApi = {
  async getAll(): Promise<Subject[]> {
    try {
      return await http.get<Subject[]>('/subjects');
    } catch {
      const { dummySubjects } = await import('../data/dummyData');
      return dummySubjects;
    }
  },

  async getById(id: string): Promise<Subject | undefined> {
    try {
      return await http.get<Subject>(`/subjects/${id}`);
    } catch {
      const { dummySubjects } = await import('../data/dummyData');
      return dummySubjects.find((item: Subject) => item.id === id);
    }
  },

  async getNames(subjectIds: string[]): Promise<string> {
    const items = await this.getAll();
    return subjectIds.map((subId) => items.find((sub) => sub.id === subId)?.name || 'Unknown').join(', ');
  },

  async create(subject: Omit<Subject, 'id'>): Promise<Subject> {
    const created = await http.post<Subject>('/subjects', subject);
    getDispatch()(addSubject(created));
    getDispatch()(addToast({ message: `Subject "${created.name}" created`, type: 'success' }));
    await delay();
    return created;
  },

  async update(subject: Subject): Promise<void> {
    await http.patch(`/subjects/${subject.id}`, subject);
    getDispatch()(updateSubject(subject));
    getDispatch()(addToast({ message: `Subject "${subject.name}" updated`, type: 'success' }));
    await delay();
  },

  async delete(id: string): Promise<void> {
    const subject = await this.getById(id);
    await http.delete(`/subjects/${id}`);
    getDispatch()(deleteSubject(id));
    getDispatch()(addToast({ message: `Subject "${subject?.name}" deleted`, type: 'info' }));
    await delay();
  },
};

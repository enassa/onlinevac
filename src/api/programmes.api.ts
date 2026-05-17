import { http } from '../utils/httpClient';
import { getDispatch } from './storeRef';
import { addProgramme, updateProgramme, deleteProgramme } from '../features/programmes/programmes.slice';
import { addToast } from '../features/toast/toast.slice';
import type { Programme } from '../types';

function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const programmesApi = {
  async getAll(): Promise<Programme[]> {
    try {
      return await http.get<Programme[]>('/programmes');
    } catch {
      const { dummyProgrammes } = await import('../data/dummyData');
      return dummyProgrammes;
    }
  },

  async getById(id: string): Promise<Programme | undefined> {
    try {
      return await http.get<Programme>(`/programmes/${id}`);
    } catch {
      const { dummyProgrammes } = await import('../data/dummyData');
      return dummyProgrammes.find((item: Programme) => item.id === id);
    }
  },

  async create(programme: Omit<Programme, 'id'>): Promise<Programme> {
    const created = await http.post<Programme>('/programmes', programme);
    getDispatch()(addProgramme(created));
    getDispatch()(addToast({ message: `Programme "${created.name}" created`, type: 'success' }));
    await delay();
    return created;
  },

  async update(programme: Programme): Promise<void> {
    await http.patch(`/programmes/${programme.id}`, programme);
    getDispatch()(updateProgramme(programme));
    getDispatch()(addToast({ message: `Programme "${programme.name}" updated`, type: 'success' }));
    await delay();
  },

  async delete(id: string): Promise<void> {
    await http.delete(`/programmes/${id}`);
    getDispatch()(deleteProgramme(id));
    const programme = await programmesApi.getById(id);
    getDispatch()(addToast({ message: `Programme "${programme?.name}" deleted`, type: 'info' }));
    await delay();
  },
};

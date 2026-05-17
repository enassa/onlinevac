import { getState, getDispatch } from './storeRef';
import { login, logout } from '../features/auth/auth.slice';
import type { UserRole } from '../types';

const DEMO_USERS: Record<UserRole, { userId: string; userName: string }> = {
  admin: { userId: 'admin-1', userName: 'System Admin' },
  teacher: { userId: 'tch-1', userName: 'Mr. Johnson' },
  student: { userId: 'stu-1', userName: 'Kwame Asare' },
};

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authApi = {
  getSession() {
    const { auth } = getState();
    return Promise.resolve(auth);
  },

  async demoLogin(role: UserRole) {
    const user = DEMO_USERS[role];
    getDispatch()(login({ role, userId: user.userId, userName: user.userName }));
    await delay();
    return { role, ...user };
  },

  async logout() {
    getDispatch()(logout());
    await delay();
  },
};

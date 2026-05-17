import { useAppDispatch } from '../../app/hooks';
import { login } from './auth.slice';
import type { UserRole } from '../../types';
import { authApi } from '../../api';

const demoUsers: Record<UserRole, { userId: string; userName: string }> = {
  admin: { userId: 'admin-1', userName: 'System Admin' },
  teacher: { userId: 'tch-1', userName: 'Mr. Johnson' },
  student: { userId: 'stu-1', userName: 'Kwame Asare' },
};

export function useAuth() {
  const dispatch = useAppDispatch();

  const demoLogin = async (role: UserRole) => {
    const user = demoUsers[role];
    dispatch(login({ role, userId: user.userId, userName: user.userName }));
    await authApi.demoLogin(role);
  };

  return { demoLogin };
}

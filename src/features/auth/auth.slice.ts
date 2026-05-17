import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserRole } from '../../types';

const initialState: AuthState = {
  role: null,
  userId: null,
  userName: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ role: UserRole; userId: string; userName: string }>) {
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.role = null;
      state.userId = null;
      state.userName = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

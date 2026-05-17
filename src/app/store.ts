import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import subjectsReducer from '../features/subjects/subjects.slice';
import programmesReducer from '../features/programmes/programmes.slice';
import teachersReducer from '../features/teachers/teachers.slice';
import vacationClassReducer from '../features/vacation-class/vacationClass.slice';
import timetableReducer from '../features/timetable/timetable.slice';
import studentsReducer from '../features/students/students.slice';
import toastReducer from '../features/toast/toast.slice';
import { setStoreRef } from '../api/storeRef';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectsReducer,
    programmes: programmesReducer,
    teachers: teachersReducer,
    vacationClass: vacationClassReducer,
    timetable: timetableReducer,
    students: studentsReducer,
    toast: toastReducer,
  },
});

setStoreRef(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

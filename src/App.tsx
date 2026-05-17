import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppLayout from './components/layout/AppLayout';
import Auth from './features/auth/Auth';
import DashboardAdmin from './features/dashboard-admin/DashboardAdmin';
import Subjects from './features/subjects/Subjects';
import Programmes from './features/programmes/Programmes';
import Teachers from './features/teachers/Teachers';
import VacationClass from './features/vacation-class/VacationClass';
import Timetable from './features/timetable/Timetable';
import DashboardTeacher from './features/dashboard-teacher/DashboardTeacher';
import TeacherSchedule from './features/teacher-schedule/TeacherSchedule';
import TeacherAvailability from './features/teacher-availability/TeacherAvailability';
import DashboardStudent from './features/dashboard-student/DashboardStudent';
import StudentJoin from './features/students/StudentJoin';
import StudentTimetable from './features/students/StudentTimetable';
import ToastContainer from './components/ui/ToastContainer';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/subjects" element={<Subjects />} />
            <Route path="/admin/programmes" element={<Programmes />} />
            <Route path="/admin/teachers" element={<Teachers />} />
            <Route path="/admin/vacation-classes" element={<VacationClass />} />
            <Route path="/admin/vacation-classes/:id/timetable" element={<Timetable />} />
            <Route path="/teacher" element={<DashboardTeacher />} />
            <Route path="/teacher/schedule" element={<TeacherSchedule />} />
            <Route path="/teacher/availability" element={<TeacherAvailability />} />
            <Route path="/student" element={<DashboardStudent />} />
            <Route path="/student/join" element={<StudentJoin />} />
            <Route path="/student/timetable" element={<StudentTimetable />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

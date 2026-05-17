import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  Calendar,
  Clock,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/auth.slice';

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Subjects', path: '/admin/subjects', icon: BookOpen },
  { label: 'Programmes', path: '/admin/programmes', icon: Layers },
  { label: 'Teachers', path: '/admin/teachers', icon: Users },
  { label: 'Vacation Classes', path: '/admin/vacation-classes', icon: Calendar },
];

const teacherNav: NavItem[] = [
  { label: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
  { label: 'My Schedule', path: '/teacher/schedule', icon: Clock },
  { label: 'Availability', path: '/teacher/availability', icon: Calendar },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
  { label: 'My Timetable', path: '/student/timetable', icon: Clock },
  { label: 'Join Programme', path: '/student/join', icon: GraduationCap },
];

const roleColorMap = {
  admin: 'from-indigo-600 to-indigo-800',
  teacher: 'from-emerald-600 to-emerald-800',
  student: 'from-violet-600 to-violet-800',
};

export default function Sidebar() {
  const { role, userName } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const navItems = role === 'admin' ? adminNav : role === 'teacher' ? teacherNav : studentNav;

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className={`px-6 py-5 bg-gradient-to-br ${roleColorMap[role!]}`}>
        <h1 className="text-xl font-bold text-white tracking-tight">VacaClass</h1>
        <p className="text-xs text-white/70 mt-0.5">Vacation Class Manager</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin' || item.path === '/teacher' || item.path === '/student'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
            {userName?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

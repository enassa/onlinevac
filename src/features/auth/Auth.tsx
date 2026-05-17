import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from './auth.hook';
import type { UserRole } from '../../types';

const roles: { role: UserRole; label: string; description: string; icon: typeof Shield; gradient: string }[] = [
  {
    role: 'admin',
    label: 'System Admin',
    description: 'Manage subjects, programmes, teachers, and vacation classes',
    icon: Shield,
    gradient: 'from-indigo-500 to-indigo-700',
  },
  {
    role: 'teacher',
    label: 'Teacher',
    description: 'View schedule, set availability and subject preferences',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-emerald-700',
  },
  {
    role: 'student',
    label: 'Student',
    description: 'Join programmes and view your personal timetable',
    icon: GraduationCap,
    gradient: 'from-violet-500 to-violet-700',
  },
];

export default function Auth() {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    demoLogin(role);
    const routes: Record<UserRole, string> = { admin: '/admin', teacher: '/teacher', student: '/student' };
    navigate(routes[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4"
          >
            <GraduationCap size={32} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">VacaClass</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Vacation Class Management System</p>
        </div>

        <div className="space-y-4">
          {roles.map((item, index) => (
            <motion.button
              key={item.role}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              onClick={() => handleLogin(item.role)}
              className="w-full card-base p-5 flex items-center gap-4 text-left group cursor-pointer"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                <item.icon size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.label}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <div className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8">
          Demo mode — click any role to explore
        </p>
      </motion.div>
    </div>
  );
}

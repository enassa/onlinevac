import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAppSelector } from '../../app/hooks';

export default function AppLayout() {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('vacaclass-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('vacaclass-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <TopBar isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
        <main className="flex-1 min-h-0 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

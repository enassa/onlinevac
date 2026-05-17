import { Moon, Sun } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';

interface TopBarProps {
  onToggleTheme: () => void;
  isDark: boolean;
}

export default function TopBar({ onToggleTheme, isDark }: TopBarProps) {
  const { userName, role } = useAppSelector((state) => state.auth);

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Welcome back, <span className="font-medium text-slate-900 dark:text-white">{userName}</span>
        </p>
      </div>
      <button
        onClick={onToggleTheme}
        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}

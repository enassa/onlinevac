import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'violet' | 'rose' | 'sky';
  index?: number;
}

const colorMap = {
  indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  violet: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
  rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
  sky: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
};

export default function StatCard({ label, value, icon: Icon, color, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="card-base p-5 flex items-center gap-4"
    >
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}

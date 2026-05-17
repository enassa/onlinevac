import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { removeToast } from '../../features/toast/toast.slice';
import type { ToastType } from '../../features/toast/toast.slice';

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap: Record<ToastType, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-sky-600 text-white',
  warning: 'bg-amber-500 text-white',
};

export default function ToastContainer() {
  const toasts = useAppSelector((state) => state.toast.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-elevated ${colorMap[toast.type]}`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{toast.message}</span>
              <button onClick={() => dispatch(removeToast(toast.id))} className="ml-2 hover:opacity-70">
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

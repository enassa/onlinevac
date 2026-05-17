import { motion } from 'framer-motion';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import { useStudentTimetable } from './studentTimetable.hook';
import { DAYS } from '../../types';

const subjectColors: Record<string, string> = {
  core: 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700',
  elective: 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700',
};

export default function StudentTimetable() {
  const { programme, getSubjectName, getSubjectType, getTeacherName, getSlotForCell, timetableHours } = useStudentTimetable();

  if (!programme) {
    return <AnimatedPage><PageHeader title="My Timetable" description="Join a programme first" /><div className="card-base p-8 text-center"><p className="text-slate-500">You need to join a programme to see your timetable.</p></div></AnimatedPage>;
  }

  return (
    <AnimatedPage>
      <PageHeader title="My Timetable" description={`Programme: ${programme.name}`} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[90px_repeat(5,1fr)] gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 text-xs font-semibold text-slate-500 flex items-center justify-center">Time</div>
            {DAYS.filter((day) => day !== 'Saturday').map((day) => (
              <div key={day} className="bg-slate-50 dark:bg-slate-900 p-3 text-xs font-semibold text-slate-500 text-center">{day}</div>
            ))}
            {timetableHours.map((hour) => (
              <div key={hour} className="contents">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-xs font-medium text-slate-500 flex items-center justify-center">{hour}:00</div>
                {DAYS.filter((day) => day !== 'Saturday').map((day) => {
                  const slot = getSlotForCell(day, hour);
                  if (!slot) return <div key={`${day}-${hour}`} className="bg-white dark:bg-slate-900 p-1 min-h-[50px]" />;
                  const slotType = getSubjectType(slot.subjectId);
                  return (
                    <div key={`${day}-${hour}`} className={`p-2 min-h-[50px] border-l-2 ${subjectColors[slotType]}`}>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{getSubjectName(slot.subjectId)}</p>
                      <p className="text-[10px] text-slate-500 truncate">{getTeacherName(slot.teacherId)}</p>
                      {slot.meetingLink && (
                        <button type="button" onClick={() => window.open(slot.meetingLink, '_blank', 'noopener,noreferrer')} className="mt-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                          Join Class
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}

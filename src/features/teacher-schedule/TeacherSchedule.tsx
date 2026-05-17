import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { Clock, BookOpen } from 'lucide-react';
import { useTeacherSchedule } from './teacherSchedule.hook';
import { DAYS } from '../../types';

export default function TeacherSchedule() {
  const { teacher, getSubjectName, getSlotForCell, totalHours, uniqueSubjects, timetableHours } = useTeacherSchedule();

  return (
    <AnimatedPage>
      <PageHeader title="My Schedule" description="Your weekly teaching timetable" />

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <StatCard label="Weekly Hours" value={totalHours} icon={Clock} color="emerald" index={0} />
        <StatCard label="Subjects Teaching" value={uniqueSubjects.length} icon={BookOpen} color="amber" index={1} />
      </div>

      <div className="overflow-x-auto">
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
                  return (
                    <div key={`${day}-${hour}`} className="p-2 min-h-[50px] bg-emerald-50 dark:bg-emerald-950/30 border-l-2 border-emerald-400 dark:border-emerald-600">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{getSubjectName(slot.subjectId)}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

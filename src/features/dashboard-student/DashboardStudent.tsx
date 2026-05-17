import { useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import { timetablesApi, subjectsApi, studentsApi } from '../../api';
import { DAYS, type VacationClass } from '../../types';

export default function DashboardStudent() {
  const auth = useAppSelector((state) => state.auth);
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const student = studentsApi.getById(auth.userId || '');
  const programme = student?.programmeId ? studentsApi.getProgrammeForStudent(auth.userId || '') : null;
  const sortedVacationClasses = [...vacationClasses].sort((classA, classB) => classB.startDate.localeCompare(classA.startDate));
  const [selectedVacationClassId, setSelectedVacationClassId] = useState(sortedVacationClasses[0]?.id ?? '');
  const selectedVacationClass = vacationClasses.find((vacationClass: VacationClass) => vacationClass.id === selectedVacationClassId) ?? sortedVacationClasses[0];
  const timetable = selectedVacationClass ? timetablesApi.getByVacationClass(selectedVacationClass.id) : undefined;

  const mySubjectIds = programme ? [...(programme.coreSubjectIds ?? []), ...(programme.electiveSubjectIds ?? [])] : [];
  const mySlots = timetable?.slots.filter((slot) => slot.programmeIds.some((pid) => pid === student?.programmeId) && mySubjectIds.includes(slot.subjectId)) || [];
  const totalWeeklyHours = mySlots.length;

  const dayIndex = new Date().getDay() === 0 ? 5 : new Date().getDay() - 1;
  const today = DAYS[dayIndex] || 'Monday';
  const todaySlots = mySlots.filter((slot) => slot.day === today).sort((slotA, slotB) => slotA.startHour - slotB.startHour);

  return (
    <AnimatedPage>
      <PageHeader title="Student Dashboard" description={`Welcome, ${auth.userName}`} />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Weekly Hours" value={totalWeeklyHours} icon={Calendar} color="sky" index={0} />
        <StatCard label="Subjects" value={mySubjectIds.length} icon={BookOpen} color="amber" index={1} />
        <StatCard label="Programme" value={programme ? 1 : 0} icon={GraduationCap} color="violet" index={2} />
      </div>

      <div className="card-base p-4 mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Vacation Class Session</label>
        <select value={selectedVacationClass?.id ?? ''} onChange={(event) => setSelectedVacationClassId(event.target.value)} className="input-base max-w-md">
          {sortedVacationClasses.map((vacationClass) => (
            <option key={vacationClass.id} value={vacationClass.id}>{vacationClass.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-base p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Today's Classes</h3>
          {todaySlots.length === 0 ? (
            <p className="text-sm text-slate-500">No classes scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todaySlots.map((slot) => {
                const subject = subjectsApi.getById(slot.subjectId);
                return (
                  <div key={slot.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="text-sm font-mono text-slate-500">{slot.startHour}:00</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{subject?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{subject?.type === 'core' ? 'Core' : 'Elective'}</p>
                    </div>
                    {slot.meetingLink && (
                      <button type="button" onClick={() => window.open(slot.meetingLink, '_blank', 'noopener,noreferrer')} className="btn-primary py-1.5 text-xs">
                        Join
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card-base p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">My Programme</h3>
          {programme ? (
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{programme.name}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Core</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(programme.coreSubjectIds ?? []).map((subId) => (
                      <span key={subId} className="badge-core">{subjectsApi.getById(subId)?.name || subId}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Electives</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(programme.electiveSubjectIds ?? []).map((subId) => (
                      <span key={subId} className="badge-elective">{subjectsApi.getById(subId)?.name || subId}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">You haven't joined a programme yet.</p>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}

import { useAppSelector } from '../../app/hooks';
import { useState } from 'react';
import { Clock, BookOpen, Calendar, Play, Video } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import { timetablesApi, subjectsApi } from '../../api';
import { DAYS, TimeSlot, type VacationClass } from '../../types';

export default function DashboardTeacher() {
  const auth = useAppSelector((state) => state.auth);
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const sortedVacationClasses = [...vacationClasses].sort((classA, classB) => classB.startDate.localeCompare(classA.startDate));
  const [selectedVacationClassId, setSelectedVacationClassId] = useState(sortedVacationClasses[0]?.id ?? '');
  const selectedVacationClass = vacationClasses.find((vacationClass: VacationClass) => vacationClass.id === selectedVacationClassId) ?? sortedVacationClasses[0];
  const timetable = selectedVacationClass ? timetablesApi.getByVacationClass(selectedVacationClass.id) : undefined;

  const mySlots = timetable?.slots.filter((slot) => slot.teacherId === auth.userId) || [];
  const totalWeeklyHours = mySlots.length;
  const uniqueSubjectIds = [...new Set(mySlots.map((slot) => slot.subjectId))];

  const dayIndex = new Date().getDay() === 0 ? 5 : new Date().getDay() - 1;
  const today = DAYS[dayIndex] || 'Monday';
  const todaySlots = mySlots.filter((slot) => slot.day === today).sort((slotA, slotB) => slotA.startHour - slotB.startHour);
  const [meetingLinks, setMeetingLinks] = useState<Record<string, string>>({});

  const handleStartClass = (slot: TimeSlot) => {
    if (!timetable) return;
    const meetingLink = slot.meetingLink || meetingLinks[slot.id]?.trim();
    if (!meetingLink) {
      setMeetingLinks((currentLinks) => ({ ...currentLinks, [slot.id]: '' }));
      return;
    }

    const updatedSlot = timetablesApi.startClass(timetable.id, slot.id, meetingLink);
    if (updatedSlot?.meetingLink) {
      window.open(updatedSlot.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatedPage>
      <PageHeader title="Teacher Dashboard" description={`Welcome, ${auth.userName}`} />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Weekly Hours" value={totalWeeklyHours} icon={Clock} color="emerald" index={0} />
        <StatCard label="Subjects" value={uniqueSubjectIds.length} icon={BookOpen} color="amber" index={1} />
        <StatCard label="Vacation Class" value={selectedVacationClass ? 1 : 0} icon={Calendar} color="sky" index={2} />
      </div>

      <div className="card-base p-4 mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Vacation Class Session</label>
        <select value={selectedVacationClass?.id ?? ''} onChange={(event) => setSelectedVacationClassId(event.target.value)} className="input-base max-w-md">
          {sortedVacationClasses.map((vacationClass) => (
            <option key={vacationClass.id} value={vacationClass.id}>{vacationClass.name}</option>
          ))}
        </select>
      </div>

      <div className="card-base p-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Today's Classes</h3>
        {todaySlots.length === 0 ? (
          <p className="text-sm text-slate-500">No classes scheduled for today.</p>
        ) : (
          <div className="space-y-2">
            {todaySlots.map((slot) => {
              const subject = subjectsApi.getById(slot.subjectId);
              const needsMeetingLink = !slot.meetingLink && Object.prototype.hasOwnProperty.call(meetingLinks, slot.id);

              return (
                <div key={slot.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-mono text-slate-500">{slot.startHour}:00</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{subject?.name || 'Unknown'}</p>
                        {slot.status === 'live' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">LIVE</span>}
                      </div>
                      <p className="text-xs text-slate-500">{subject?.type === 'core' ? 'Core' : 'Elective'}</p>
                    </div>
                    <button onClick={() => handleStartClass(slot)} className="btn-primary flex items-center gap-2 text-sm py-2">
                      {slot.status === 'live' ? <Video size={14} /> : <Play size={14} />}
                      {slot.status === 'live' ? 'Join' : 'Start'}
                    </button>
                  </div>
                  {needsMeetingLink && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="url"
                        value={meetingLinks[slot.id]}
                        onChange={(event) => setMeetingLinks((currentLinks) => ({ ...currentLinks, [slot.id]: event.target.value }))}
                        className="input-base text-sm"
                        placeholder="Paste Google Meet, Zoom, or Teams link"
                      />
                      <button onClick={() => handleStartClass(slot)} className="btn-secondary text-sm">Save & Start</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card-base p-6 mt-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">My Subjects</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueSubjectIds.map((subId) => {
            const subject = subjectsApi.getById(subId);
            return (
              <span key={subId} className={subject?.type === 'core' ? 'badge-core' : 'badge-elective'}>
                {subject?.name || 'Unknown'}
              </span>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
}

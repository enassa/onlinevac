import { useState, useEffect } from 'react';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { vacationClassApi } from '../../api';
import { DAYS, HOURS } from '../../types';
import type { TeacherAvailability, TeacherSubjectPreference } from '../../types';

export default function TeacherAvailability() {
  const auth = useAppSelector((state) => state.auth);
  const teachers = useAppSelector((state) => state.teachers.items);
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const subjects = useAppSelector((state) => state.subjects.items);
  const teacher = teachers.find((t) => t.id === auth.userId);
  const activeClass = vacationClasses.find((vc) => vc.status === 'active');

  const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>([]);
  const [preferences, setPreferences] = useState<TeacherSubjectPreference | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (activeClass) {
      const myAvail = activeClass.teacherAvailabilities.filter((avail) => avail.teacherId === auth.userId);
      const myPref = activeClass.teacherSubjectPreferences.find((pref) => pref.teacherId === auth.userId);
      setAvailabilities(myAvail);
      setPreferences(myPref || null);
    }
  }, [activeClass, auth.userId]);

  const handleAvailabilityChange = (day: string, field: 'startHour' | 'endHour', value: number) => {
    setAvailabilities((prev) => prev.map((avail) =>
      avail.day === day ? { ...avail, [field]: value } : avail
    ));
    setHasChanges(true);
  };

  const handleToggleSubject = (subjectId: string) => {
    if (!preferences) return;
    setPreferences((prev) => {
      if (!prev) return prev;
      const subjectIds = prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter((sid) => sid !== subjectId)
        : [...prev.subjectIds, subjectId];
      return { ...prev, subjectIds };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!activeClass) return;
    const allAvailabilities = activeClass.teacherAvailabilities.filter((avail) => avail.teacherId !== auth.userId);
    await vacationClassApi.updateAvailabilities(activeClass.id, [...allAvailabilities, ...availabilities]);

    if (preferences) {
      const allPreferences = activeClass.teacherSubjectPreferences.filter((pref) => pref.teacherId !== auth.userId);
      await vacationClassApi.updatePreferences(activeClass.id, [...allPreferences, preferences]);
    }
    setHasChanges(false);
  };

  if (!activeClass) {
    return <AnimatedPage><PageHeader title="Availability & Preferences" description="Set your available days and subjects" /><div className="card-base p-8 text-center"><p className="text-slate-500">No active vacation class to configure.</p></div></AnimatedPage>;
  }

  const availableDays = DAYS.filter((day) => day !== 'Saturday');

  return (
    <AnimatedPage>
      <PageHeader title="Availability & Preferences" description="Set your available days and subjects for this vacation class" />

      <div className="space-y-6">
        <div className="card-base p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Weekly Availability</h3>
          <div className="space-y-3">
            {availableDays.map((day) => {
              const dayAvail = availabilities.find((avail) => avail.day === day);
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium text-slate-700 dark:text-slate-300">{day}</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={dayAvail?.startHour ?? 8}
                      onChange={(event) => handleAvailabilityChange(day, 'startHour', Number(event.target.value))}
                      className="input-base w-20 text-sm py-1.5"
                    >
                      {HOURS.map((hour) => <option key={hour} value={hour}>{hour}:00</option>)}
                    </select>
                    <span className="text-sm text-slate-400">to</span>
                    <select
                      value={dayAvail?.endHour ?? 15}
                      onChange={(event) => handleAvailabilityChange(day, 'endHour', Number(event.target.value))}
                      className="input-base w-20 text-sm py-1.5"
                    >
                      {HOURS.map((hour) => <option key={hour} value={hour}>{hour}:00</option>)}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-base p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Subjects I Want to Teach</h3>
          <div className="flex flex-wrap gap-2">
            {teacher?.subjectIds.map((subId) => {
              const subject = subjects.find((sub) => sub.id === subId);
              const isSelected = preferences?.subjectIds.includes(subId);
              return (
                <button
                  key={subId}
                  type="button"
                  onClick={() => handleToggleSubject(subId)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-2 ring-emerald-500'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 line-through opacity-60'
                  }`}
                >
                  {subject?.name || subId}
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={handleSave} disabled={!hasChanges} className={`btn-primary ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Save Changes
        </button>
      </div>
    </AnimatedPage>
  );
}

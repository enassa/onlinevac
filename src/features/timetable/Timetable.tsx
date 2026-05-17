import { motion } from 'framer-motion';
import { useState } from 'react';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import { useTimetable } from './timetable.hook';
import type { TimeSlot } from '../../types';

const palette = [
  'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800',
  'bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-950/40 dark:text-violet-200 dark:border-violet-800',
  'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-800',
  'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800',
  'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800',
  'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800',
];

const getStableColor = (value: string) => {
  const colorIndex = value.split('').reduce((total, character) => total + character.charCodeAt(0), 0) % palette.length;
  return palette[colorIndex];
};

const formatProgrammeLabel = (programmeName: string): string => {
  return programmeName
    .replace(/^General Science with\s+/i, 'Sci: ')
    .replace(/^Business with\s+/i, 'Bus: ');
};

export default function Timetable() {
  const { vacationClass, timetable, getSubjectName, getSubjectType, getTeacherName, getProgrammeNames, getSlotsForCell } = useTimetable();
  const [expandedSlotIdByCell, setExpandedSlotIdByCell] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: number; slots: TimeSlot[] } | null>(null);

  if (!vacationClass) {
    return <AnimatedPage><p className="text-slate-500">Vacation class not found.</p></AnimatedPage>;
  }

  const timetableHours = Array.from(
    { length: Math.max(0, vacationClass.dailyEndHour - vacationClass.dailyStartHour) },
    (_, hourIndex) => vacationClass.dailyStartHour + hourIndex,
  );
  const timetableDays = vacationClass.selectedDays?.length ? vacationClass.selectedDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const isBreakCell = (day: string, hour: number) => (vacationClass.breakPeriods ?? []).some((breakPeriod) =>
    breakPeriod.day === day && hour >= breakPeriod.startHour && hour < breakPeriod.endHour
  );

  return (
    <AnimatedPage>
      <PageHeader title={vacationClass.name} description="Weekly Timetable" />

      {!timetable ? (
        <div className="card-base p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">No timetable generated yet.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="overflow-x-auto">
          <Modal isOpen={!!selectedCell} onClose={() => setSelectedCell(null)} title={selectedCell ? `${selectedCell.day} ${selectedCell.hour}:00 Cell Details` : 'Cell Details'} size="lg">
            {selectedCell && (
              <div className="space-y-3">
                {selectedCell.slots.map((slot) => {
                  const programmeNames = getProgrammeNames(slot.programmeIds);
                  return (
                    <div key={slot.id} className={`rounded-2xl border p-4 ${getStableColor(slot.subjectId)}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{getSubjectName(slot.subjectId)}</h3>
                          <p className="text-xs opacity-80">{getSubjectType(slot.subjectId)} · {slot.startHour}:00–{slot.endHour}:00</p>
                        </div>
                        <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${getStableColor(slot.teacherId)}`}>{getTeacherName(slot.teacherId)}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {programmeNames.map((programmeName) => (
                          <span key={programmeName} className="rounded-full bg-white/70 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">{programmeName}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Modal>
          <div className="min-w-[800px]">
            <div className="grid gap-px bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden" style={{ gridTemplateColumns: `100px repeat(${timetableDays.length}, minmax(0, 1fr))` }}>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 text-xs font-semibold text-slate-500 flex items-center justify-center">Time</div>
              {timetableDays.map((day) => (
                <div key={day} className="bg-slate-50 dark:bg-slate-900 p-3 text-xs font-semibold text-slate-500 text-center">{day}</div>
              ))}

              {timetableHours.map((hour) => (
                <div key={hour} className="contents">
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 text-xs font-medium text-slate-500 flex items-center justify-center">
                    {hour}:00
                  </div>
                  {timetableDays.map((day) => {
                    const cellSlots = getSlotsForCell(day, hour);
                    const cellKey = `${day}-${hour}`;
                    const breakCell = isBreakCell(day, hour);
                    if (breakCell) {
                      const breakPeriods = (vacationClass.breakPeriods ?? []).filter((breakPeriod) => breakPeriod.day === day && hour >= breakPeriod.startHour && hour < breakPeriod.endHour);
                      return (
                        <div key={cellKey} className="bg-amber-50 dark:bg-amber-950/20 p-2 min-h-[60px] flex items-center justify-center border border-amber-100 dark:border-amber-900/40">
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-900/50 dark:text-amber-200">
                            {breakPeriods[0]?.label || 'Break'}
                          </span>
                        </div>
                      );
                    }
                    if (cellSlots.length === 0) {
                      return <div key={cellKey} className="bg-white dark:bg-slate-900 p-1 min-h-[60px]" />;
                    }

                    const expandedSlot = cellSlots.find((slot) => slot.id === expandedSlotIdByCell[cellKey]) || cellSlots[0];
                    const expandedSlotType = getSubjectType(expandedSlot.subjectId);
                    const expandedProgrammeNames = getProgrammeNames(expandedSlot.programmeIds);

                    return (
                      <div key={cellKey} className="bg-white dark:bg-slate-900 p-1 min-h-[92px] space-y-1.5">
                        {cellSlots.length > 1 && (
                          <div className="flex items-center justify-between px-1">
                            <span className="text-[9px] font-bold uppercase tracking-wide text-indigo-500">{cellSlots.length} parallel</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {cellSlots.map((slot) => {
                            const isExpanded = expandedSlot.id === slot.id;

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setExpandedSlotIdByCell((current) => ({ ...current, [cellKey]: slot.id }))}
                                title={getProgrammeNames(slot.programmeIds).join(', ')}
                                className={`max-w-full rounded-md border px-2 py-1 text-left text-[10px] font-semibold transition-all duration-200 ${getStableColor(slot.subjectId)} ${isExpanded ? 'ring-2 ring-indigo-500 shadow-sm' : ''}`}
                              >
                                <span className="block max-w-[110px] truncate">{getSubjectName(slot.subjectId)}</span>
                              </button>
                            );
                          })}
                        </div>
                        <motion.div
                          key={expandedSlot.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.16 }}
                          className={`p-2 rounded-lg border shadow-sm ${getStableColor(expandedSlot.subjectId)}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{getSubjectName(expandedSlot.subjectId)}</p>
                            <span className="text-[9px] font-semibold uppercase text-slate-500 dark:text-slate-400">{expandedSlotType}</span>
                          </div>
                          <p className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStableColor(expandedSlot.teacherId)}`}>{getTeacherName(expandedSlot.teacherId)}</p>
                          {expandedProgrammeNames.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {expandedProgrammeNames.slice(0, 2).map((programmeName) => (
                                <span key={programmeName} className="max-w-[92px] truncate rounded-full bg-white/70 dark:bg-slate-950/40 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:text-slate-300">
                                  {formatProgrammeLabel(programmeName)}
                                </span>
                              ))}
                              {expandedProgrammeNames.length > 2 && (
                                <span className="rounded-full bg-slate-900/10 dark:bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:text-slate-300">
                                  +{expandedProgrammeNames.length - 2} programmes
                                </span>
                              )}
                            </div>
                          )}
                          <button type="button" onClick={() => setSelectedCell({ day, hour, slots: cellSlots })} className="mt-2 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
                            View cell details
                          </button>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700" />
              <span className="text-xs text-slate-500">Core Subject</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700" />
              <span className="text-xs text-slate-500">Elective Subject</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatedPage>
  );
}

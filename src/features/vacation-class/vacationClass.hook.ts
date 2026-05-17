import { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { vacationClassApi, subjectsApi, programmesApi, teachersApi } from '../../api';
import type { BreakPeriod, Day, VacationClass, TeacherAvailability, TeacherSubjectPreference } from '../../types';
import type { SchedulerReport } from '../timetable/scheduler';

export function useVacationClass() {
  const vacationClasses = useAppSelector((state) => state.vacationClass.items);
  const programmes = useAppSelector((state) => state.programmes.items);
  const teachers = useAppSelector((state) => state.teachers.items);
  const subjects = useAppSelector((state) => state.subjects.items);
  const timetables = useAppSelector((state) => state.timetable.items);
  const students = useAppSelector((state) => state.students.items);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [lastReport, setLastReport] = useState<SchedulerReport | null>(null);

  const [formName, setFormName] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formSelectedDays, setFormSelectedDays] = useState<Day[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [formBreakPeriods, setFormBreakPeriods] = useState<BreakPeriod[]>([]);
  const [formDailyStartHour, setFormDailyStartHour] = useState(7);
  const [formDailyEndHour, setFormDailyEndHour] = useState(18);
  const [formProgrammeIds, setFormProgrammeIds] = useState<string[]>([]);
  const [formTeacherIds, setFormTeacherIds] = useState<string[]>([]);
  const [formAvailabilities, setFormAvailabilities] = useState<TeacherAvailability[]>([]);
  const [formPreferences, setFormPreferences] = useState<TeacherSubjectPreference[]>([]);

  const resetForm = () => {
    setFormName(''); setFormStartDate(''); setFormEndDate('');
    setFormSelectedDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setFormBreakPeriods([]);
    setFormDailyStartHour(7); setFormDailyEndHour(18);
    setFormProgrammeIds([]); setFormTeacherIds([]);
    setFormAvailabilities([]); setFormPreferences([]);
    setStep(0);
  };

  const openCreate = () => { resetForm(); setEditingId(null); setIsCreateOpen(true); };
  const closeCreate = () => { setIsCreateOpen(false); setEditingId(null); resetForm(); };

  const openEdit = (vcId: string) => {
    const vc = vacationClasses.find((item: VacationClass) => item.id === vcId);
    if (!vc) return;
    setEditingId(vcId);
    setFormName(vc.name);
    setFormStartDate(vc.startDate);
    setFormEndDate(vc.endDate);
    setFormSelectedDays(vc.selectedDays?.length ? [...vc.selectedDays] : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setFormBreakPeriods([...(vc.breakPeriods ?? [])]);
    setFormDailyStartHour(vc.dailyStartHour);
    setFormDailyEndHour(vc.dailyEndHour);
    setFormProgrammeIds([...vc.programmeIds]);
    setFormTeacherIds([...vc.teacherIds]);
    setFormAvailabilities([...vc.teacherAvailabilities]);
    setFormPreferences([...vc.teacherSubjectPreferences]);
    setStep(0);
    setIsCreateOpen(true);
  };

  const toggleProgramme = (id: string) => {
    setFormProgrammeIds((prev) => prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]);
  };

  const toggleTeacher = (id: string) => {
    setFormTeacherIds((prev) => {
      const next = prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id];
      if (!prev.includes(id)) {
        const teacher = teachers.find((tch) => tch.id === id);
        if (teacher) {
          const defaultAvail = formSelectedDays.map((day) => ({
            teacherId: id, day, startHour: formDailyStartHour, endHour: formDailyEndHour,
          }));
          setFormAvailabilities((prevAvail) => [...prevAvail.filter((avail) => avail.teacherId !== id), ...defaultAvail]);
          setFormPreferences((prevPref) => [...prevPref.filter((pref) => pref.teacherId !== id), { teacherId: id, subjectIds: [...(teacher.subjectIds ?? [])] }]);
        }
      } else {
        setFormAvailabilities((prevAvail) => prevAvail.filter((avail) => avail.teacherId !== id));
        setFormPreferences((prevPref) => prevPref.filter((pref) => pref.teacherId !== id));
      }
      return next;
    });
  };

  const updateAvailability = (teacherId: string, day: string, field: 'startHour' | 'endHour', value: number) => {
    setFormAvailabilities((prev) => prev.map((avail) =>
      avail.teacherId === teacherId && avail.day === day ? { ...avail, [field]: value } : avail
    ));
  };

  const toggleSelectedDay = (day: Day) => {
    setFormSelectedDays((currentDays) => {
      const nextDays = currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day];

      setFormAvailabilities((currentAvailabilities) => {
        const retainedAvailabilities = currentAvailabilities.filter((availability) =>
          nextDays.includes(availability.day as Day)
        );
        const missingAvailabilities = formTeacherIds.flatMap((teacherId) =>
          nextDays
            .filter((selectedDay) => !retainedAvailabilities.some((availability) => availability.teacherId === teacherId && availability.day === selectedDay))
            .map((selectedDay) => ({ teacherId, day: selectedDay, startHour: formDailyStartHour, endHour: formDailyEndHour }))
        );

        return [...retainedAvailabilities, ...missingAvailabilities];
      });

      setFormBreakPeriods((currentBreakPeriods) =>
        currentBreakPeriods.filter((breakPeriod) => nextDays.includes(breakPeriod.day))
      );

      return nextDays;
    });
  };

  const addBreakPeriod = () => {
    const fallbackDay = formSelectedDays[0] ?? 'Monday';
    setFormBreakPeriods((currentBreakPeriods) => [
      ...currentBreakPeriods,
      {
        id: `break-${Date.now()}-${currentBreakPeriods.length + 1}`,
        label: 'Break',
        day: fallbackDay,
        startHour: Math.min(12, Math.max(formDailyStartHour, formDailyEndHour - 1)),
        endHour: Math.min(formDailyEndHour, Math.max(formDailyStartHour + 1, 13)),
      },
    ]);
  };

  const updateBreakPeriod = (breakPeriodId: string, patch: Partial<Omit<BreakPeriod, 'id'>>) => {
    setFormBreakPeriods((currentBreakPeriods) =>
      currentBreakPeriods.map((breakPeriod) => {
        if (breakPeriod.id !== breakPeriodId) return breakPeriod;
        const updatedBreakPeriod = { ...breakPeriod, ...patch };
        if (updatedBreakPeriod.endHour <= updatedBreakPeriod.startHour) {
          updatedBreakPeriod.endHour = updatedBreakPeriod.startHour + 1;
        }
        return updatedBreakPeriod;
      })
    );
  };

  const removeBreakPeriod = (breakPeriodId: string) => {
    setFormBreakPeriods((currentBreakPeriods) => currentBreakPeriods.filter((breakPeriod) => breakPeriod.id !== breakPeriodId));
  };

  const togglePreferenceSubject = (teacherId: string, subjectId: string) => {
    setFormPreferences((prev) => prev.map((pref) =>
      pref.teacherId === teacherId ? {
        ...pref,
        subjectIds: (pref.subjectIds ?? []).includes(subjectId)
          ? (pref.subjectIds ?? []).filter((sid) => sid !== subjectId)
          : [...(pref.subjectIds ?? []), subjectId],
      } : pref
    ));
  };

  const handleCreate = async () => {
    await vacationClassApi.create({
      name: formName, startDate: formStartDate, endDate: formEndDate,
      selectedDays: formSelectedDays,
      breakPeriods: formBreakPeriods,
      dailyStartHour: formDailyStartHour, dailyEndHour: formDailyEndHour,
      programmeIds: formProgrammeIds, teacherIds: formTeacherIds,
      teacherAvailabilities: formAvailabilities, teacherSubjectPreferences: formPreferences,
      status: 'draft', timetableId: null,
    });
    closeCreate();
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const existing = vacationClasses.find((item: VacationClass) => item.id === editingId);
    if (!existing) return;

    await vacationClassApi.update({
      ...existing,
      name: formName,
      startDate: formStartDate,
      endDate: formEndDate,
      selectedDays: formSelectedDays,
      breakPeriods: formBreakPeriods,
      dailyStartHour: formDailyStartHour,
      dailyEndHour: formDailyEndHour,
      programmeIds: formProgrammeIds,
      teacherIds: formTeacherIds,
      teacherAvailabilities: formAvailabilities,
      teacherSubjectPreferences: formPreferences,
    });

    // Auto-regenerate timetable if one existed
    if (existing.timetableId) {
      const result = await vacationClassApi.generateTimetableForClass(editingId);
      if (result && typeof result === 'object' && 'report' in result) {
        setLastReport(result.report);
      }
    }

    closeCreate();
  };

  const handleGenerateTimetable = async (vacationClassId: string) => {
    const result = await vacationClassApi.generateTimetableForClass(vacationClassId);
    if (result && typeof result === 'object' && 'report' in result) {
      setLastReport(result.report);
    }
  };

  const handleViewReport = (vacationClassId: string) => {
    const report = vacationClassApi.getReport(vacationClassId);
    if (report) setLastReport(report);
  };

  const handleDelete = async (id: string) => {
    await vacationClassApi.delete(id);
  };

  const getSubjectName = (subjectId: string) => subjects.find((sub) => sub.id === subjectId)?.name || 'Unknown';
  const getProgrammeName = (programmeId: string) => programmes.find((prog) => prog.id === programmeId)?.name || 'Unknown';
  const getTeacherName = (teacherId: string) => teachers.find((teacher) => teacher.id === teacherId)?.name || 'Unknown';

  const selectedSubjects = [...new Set(formProgrammeIds.flatMap((pid) => {
    const prog = programmes.find((programme) => programme.id === pid);
    return prog ? [...(prog.coreSubjectIds ?? []), ...(prog.electiveSubjectIds ?? [])] : [];
  }))];

  return {
    vacationClasses, timetables, isCreateOpen, step, formName, formStartDate, formEndDate, formSelectedDays, formBreakPeriods,
    formDailyStartHour, formDailyEndHour,
    formProgrammeIds, formTeacherIds, formAvailabilities, formPreferences,
    openCreate, closeCreate, setStep, setFormName, setFormStartDate, setFormEndDate,
    setFormDailyStartHour, setFormDailyEndHour,
    toggleSelectedDay, addBreakPeriod, updateBreakPeriod, removeBreakPeriod, toggleProgramme, toggleTeacher, updateAvailability, togglePreferenceSubject,
    handleCreate, handleUpdate, handleGenerateTimetable, handleViewReport, handleDelete,
    getSubjectName, getProgrammeName, getTeacherName, selectedSubjects,
    programmes, teachers, subjects, students, lastReport, setLastReport,
    editingId, openEdit,
  };
}

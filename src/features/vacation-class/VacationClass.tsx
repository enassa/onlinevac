import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Trash2, Zap, ChevronRight, ChevronLeft, Pencil, Users, GraduationCap, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import GenerationReport from '../timetable/GenerationReport';
import { useVacationClass } from './vacationClass.hook';
import { DAYS, type Subject, type Timetable, type VacationClass as VacationClassType } from '../../types';

export default function VacationClass() {
  const navigate = useNavigate();
  const {
    vacationClasses, timetables, isCreateOpen, step, formName, formStartDate, formEndDate, formSelectedDays, formBreakPeriods,
    formDailyStartHour, formDailyEndHour,
    formProgrammeIds, formTeacherIds, formAvailabilities, formPreferences,
    openCreate, closeCreate, setStep, setFormName, setFormStartDate, setFormEndDate,
    setFormDailyStartHour, setFormDailyEndHour,
    toggleSelectedDay, addBreakPeriod, updateBreakPeriod, removeBreakPeriod, toggleProgramme, toggleTeacher, updateAvailability, togglePreferenceSubject,
    handleCreate, handleUpdate, handleGenerateTimetable, handleViewReport, handleDelete,
    getProgrammeName, getTeacherName, selectedSubjects,
    programmes, teachers, subjects, students, lastReport, setLastReport,
    editingId, openEdit,
  } = useVacationClass();
  const [detailView, setDetailView] = useState<{ vacationClassId: string; type: 'teachers' | 'programmes' } | null>(null);

  const steps = ['Basics', 'Programmes', 'Teachers', 'Review'];
  const hourOptions = Array.from({ length: 12 }, (_, hourIndex) => hourIndex + 7);
  const detailVacationClass = detailView ? vacationClasses.find((vacationClass: VacationClassType) => vacationClass.id === detailView.vacationClassId) : null;
  const detailTimetable = detailVacationClass ? timetables.find((timetable: Timetable) => timetable.vacationClassId === detailVacationClass.id) : null;

  return (
    <AnimatedPage>
      <PageHeader title="Vacation Classes" description={`${vacationClasses.length} class periods`}
        action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} />Create Class</button>} />

      <AnimatePresence>
        {lastReport && (
          <Modal isOpen={!!lastReport} onClose={() => setLastReport(null)} title="Generation Report" size="xl">
            <GenerationReport report={lastReport} onClose={() => setLastReport(null)} />
          </Modal>
        )}
      </AnimatePresence>

      {vacationClasses.length === 0 ? (
        <EmptyState title="No vacation classes" description="Create your first vacation class period" action={<button onClick={openCreate} className="btn-primary">Create</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vacationClasses.map((vacationClass, index) => (
            <motion.div key={vacationClass.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.06 }} className="card-base p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40">
                    <Calendar size={18} className="text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{vacationClass.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{vacationClass.startDate} → {vacationClass.endDate}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  vacationClass.status === 'active' ? 'badge-active' : vacationClass.status === 'draft' ? 'badge-draft' : 'badge-completed'
                }`}>{vacationClass.status}</span>
              </div>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <p>{vacationClass.programmeIds.length} programmes · {vacationClass.teacherIds.length} teachers</p>
                <p>{(vacationClass.selectedDays ?? []).join(', ')}</p>
                <p>{vacationClass.dailyStartHour}:00 → {vacationClass.dailyEndHour}:00 daily window</p>
                {(vacationClass.breakPeriods ?? []).length > 0 && (
                  <p className="flex items-center gap-1 text-amber-600 dark:text-amber-300"><Coffee size={13} /> {vacationClass.breakPeriods.length} break periods</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => setDetailView({ vacationClassId: vacationClass.id, type: 'teachers' })} className="btn-secondary flex items-center gap-2 text-sm py-2">
                  <Users size={14} /> Teachers
                </button>
                <button onClick={() => setDetailView({ vacationClassId: vacationClass.id, type: 'programmes' })} className="btn-secondary flex items-center gap-2 text-sm py-2">
                  <GraduationCap size={14} /> Programmes
                </button>
                {vacationClass.status === 'draft' && (
                  <button onClick={() => handleGenerateTimetable(vacationClass.id)} className="btn-primary flex items-center gap-2 text-sm py-2">
                    <Zap size={14} /> Generate Timetable
                  </button>
                )}
                {vacationClass.timetableId && (
                  <button onClick={() => navigate(`/admin/vacation-classes/${vacationClass.id}/timetable`)} className="btn-secondary text-sm py-2">
                    View Timetable
                  </button>
                )}
                {(vacationClass.lastReport || vacationClass.timetableId) && (
                  <button onClick={() => handleViewReport(vacationClass.id)} className="btn-secondary text-sm py-2">
                    View Report
                  </button>
                )}
                {vacationClass.status === 'active' && !vacationClass.timetableId && (
                  <button onClick={() => handleGenerateTimetable(vacationClass.id)} className="btn-primary flex items-center gap-2 text-sm py-2">
                    <Zap size={14} /> Generate
                  </button>
                )}
                {vacationClass.status === 'active' && vacationClass.timetableId && (
                  <button onClick={() => handleGenerateTimetable(vacationClass.id)} className="btn-secondary flex items-center gap-2 text-sm py-2">
                    <Zap size={14} /> Regenerate
                  </button>
                )}
                <button onClick={() => openEdit(vacationClass.id)} className="p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 text-slate-400 hover:text-sky-600"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(vacationClass.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600"><Trash2 size={15} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={!!detailView} onClose={() => setDetailView(null)} title={`${detailVacationClass?.name ?? 'Vacation Class'} ${detailView?.type === 'teachers' ? 'Teachers' : 'Programmes'}`} size="xl">
        {detailVacationClass && detailView?.type === 'teachers' && (
          <div className="grid gap-4 md:grid-cols-2">
            {detailVacationClass.teacherIds.map((teacherId) => {
              const teacher = teachers.find((teacherItem) => teacherItem.id === teacherId);
              if (!teacher) return null;
              const teacherSlots = detailTimetable?.slots.filter((slot) => slot.teacherId === teacher.id) ?? [];
              const availability = detailVacationClass.teacherAvailabilities.filter((item) => item.teacherId === teacher.id);
              const preference = detailVacationClass.teacherSubjectPreferences.find((item) => item.teacherId === teacher.id);

              return (
                <div key={teacher.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{teacher.name}</h3>
                      <p className="text-xs text-slate-500">{teacher.email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{teacherSlots.length} classes</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</p>
                      <div className="flex flex-wrap gap-1.5">
                        {availability.map((item) => (
                          <span key={`${teacher.id}-${item.day}`} className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.day} {item.startHour}:00–{item.endHour}:00</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Teaching Subjects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(preference?.subjectIds ?? teacher.subjectIds ?? []).map((subjectId) => (
                          <span key={subjectId} className={subjects.find((subject) => subject.id === subjectId)?.type === 'core' ? 'badge-core' : 'badge-elective'}>{subjects.find((subject) => subject.id === subjectId)?.name ?? subjectId}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Timetable</p>
                      <div className="space-y-1">
                        {teacherSlots.length === 0 ? <p className="text-xs text-slate-400">No scheduled classes.</p> : teacherSlots.map((slot) => (
                          <p key={slot.id} className="text-xs text-slate-600 dark:text-slate-300">{slot.day} {slot.startHour}:00 — {subjects.find((subject) => subject.id === slot.subjectId)?.name ?? slot.subjectId}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {detailVacationClass && detailView?.type === 'programmes' && (
          <div className="grid gap-4 md:grid-cols-2">
            {detailVacationClass.programmeIds.map((programmeId) => {
              const programme = programmes.find((programmeItem) => programmeItem.id === programmeId);
              if (!programme) return null;
              const enrolledStudents = students.filter((student) => student.vacationClassId === detailVacationClass.id && student.programmeId === programme.id);
              const programmeSlots = detailTimetable?.slots.filter((slot) => slot.programmeIds.includes(programme.id)) ?? [];

              return (
                <div key={programme.id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{programme.name}</h3>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">{enrolledStudents.length} students</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Enrolled Students</p>
                      <div className="space-y-1">
                        {enrolledStudents.length === 0 ? <p className="text-xs text-slate-400">No students enrolled.</p> : enrolledStudents.map((student) => (
                          <p key={student.id} className="text-xs text-slate-600 dark:text-slate-300">{student.name} · {student.email}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Programme Timetable</p>
                      <div className="space-y-1">
                        {programmeSlots.length === 0 ? <p className="text-xs text-slate-400">No scheduled classes.</p> : programmeSlots.map((slot) => (
                          <p key={slot.id} className="text-xs text-slate-600 dark:text-slate-300">{slot.day} {slot.startHour}:00 — {subjects.find((subject) => subject.id === slot.subjectId)?.name ?? slot.subjectId}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      <Modal isOpen={isCreateOpen} onClose={closeCreate} title={`${editingId ? 'Edit' : 'Create'} Vacation Class — ${steps[step]}`} size="lg">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            {steps.map((label, index) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= step ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>{index + 1}</div>
                <span className={`text-xs font-medium ${index <= step ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{label}</span>
                {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700" />}
              </div>
            ))}
          </div>
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Class Name</label>
              <input type="text" value={formName} onChange={(event) => setFormName(event.target.value)} className="input-base" placeholder="e.g., Summer 2025 Vacation Class" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Date</label>
                <input type="date" value={formStartDate} onChange={(event) => setFormStartDate(event.target.value)} className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">End Date</label>
                <input type="date" value={formEndDate} onChange={(event) => setFormEndDate(event.target.value)} className="input-base" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Teaching Days</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DAYS.map((day) => {
                  const isSelected = formSelectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleSelectedDay(day)}
                      className={`p-2.5 rounded-lg text-sm font-medium border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Daily Teaching Window</label>
              <div className="grid grid-cols-2 gap-4">
                <select value={formDailyStartHour} onChange={(event) => setFormDailyStartHour(Number(event.target.value))} className="input-base">
                  {hourOptions.map((hour) => (
                    <option key={hour} value={hour}>{hour}:00</option>
                  ))}
                </select>
                <select value={formDailyEndHour} onChange={(event) => setFormDailyEndHour(Number(event.target.value))} className="input-base">
                  {hourOptions.map((hour) => (
                    <option key={hour} value={hour}>{hour}:00</option>
                  ))}
                </select>
              </div>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Extend this window if the report shows short credit hours.</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-200"><Coffee size={15} /> Break Periods</label>
                  <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-300/80">These weekly periods are ignored during timetable allocation.</p>
                </div>
                <button type="button" onClick={addBreakPeriod} className="btn-secondary text-sm py-2">Add Break</button>
              </div>
              {formBreakPeriods.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">No break periods configured.</p>
              ) : (
                <div className="space-y-2">
                  {formBreakPeriods.map((breakPeriod) => (
                    <div key={breakPeriod.id} className="grid gap-2 rounded-xl bg-white p-3 dark:bg-slate-900 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
                      <input value={breakPeriod.label} onChange={(event) => updateBreakPeriod(breakPeriod.id, { label: event.target.value })} className="input-base py-2 text-sm" placeholder="Break label" />
                      <select value={breakPeriod.day} onChange={(event) => updateBreakPeriod(breakPeriod.id, { day: event.target.value as typeof breakPeriod.day })} className="input-base py-2 text-sm">
                        {formSelectedDays.map((day) => <option key={day} value={day}>{day}</option>)}
                      </select>
                      <select value={breakPeriod.startHour} onChange={(event) => updateBreakPeriod(breakPeriod.id, { startHour: Number(event.target.value) })} className="input-base py-2 text-sm">
                        {hourOptions.map((hour) => <option key={hour} value={hour}>{hour}:00</option>)}
                      </select>
                      <select value={breakPeriod.endHour} onChange={(event) => updateBreakPeriod(breakPeriod.id, { endHour: Number(event.target.value) })} className="input-base py-2 text-sm">
                        {hourOptions.map((hour) => <option key={hour} value={hour}>{hour}:00</option>)}
                      </select>
                      <button type="button" onClick={() => removeBreakPeriod(breakPeriod.id)} className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Select programmes to include. Core subjects are auto-included.</p>
            <div className="grid grid-cols-2 gap-2">
              {programmes.map((prog) => (
                <button key={prog.id} type="button" onClick={() => toggleProgramme(prog.id)}
                  className={`p-3 rounded-lg text-left text-sm transition-all duration-200 border ${
                    formProgrammeIds.includes(prog.id)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}>
                  <p className="font-medium text-slate-900 dark:text-white">{prog.name}</p>
                  <p className="text-xs text-slate-500">{prog.electiveSubjectIds.length} electives</p>
                </button>
              ))}
            </div>
            {selectedSubjects.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm">
                <p className="font-medium text-slate-700 dark:text-slate-300">{selectedSubjects.length} unique subjects selected</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Select teachers and configure their availability & subject preferences.</p>
            <div className="space-y-3">
              {formTeacherIds.map((teacherId) => {
                const teacher = teachers.find((teacher) => teacher.id === teacherId);
                if (!teacher) return null;
                const preference = formPreferences.find((pref) => pref.teacherId === teacherId);
                const teacherSubjectIds: string[] = teacher.subjectIds ?? [];
                const preferenceSubjectIds: string[] = preference?.subjectIds ?? [];
                const isSelected = formTeacherIds.includes(teacher.id);

                const availability = formAvailabilities.filter((avail) => avail.teacherId === teacher.id);

                return (
                  <div key={teacher.id} className={`p-4 rounded-xl border transition-all duration-200 ${formTeacherIds.includes(teacher.id) ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-700'}`}>
                    <button type="button" onClick={() => toggleTeacher(teacher.id)} className="w-full flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${formTeacherIds.includes(teacher.id) ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                          {teacher.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-slate-900 dark:text-white">{teacher.name}</p>
                          <p className="text-xs text-slate-500">{teacherSubjectIds.length} subjects</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                    </button>

                    {isSelected && preference && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Subjects to teach</p>
                          <div className="flex flex-wrap gap-1.5">
                            {teacherSubjectIds.map((subId: string) => {
                              const subject = subjects.find((sub: Subject) => sub.id === subId);
                              return (
                                <button key={subId} type="button" onClick={() => togglePreferenceSubject(teacher.id, subId)}
                                  className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                                    preferenceSubjectIds.includes(subId)
                                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 line-through'
                                  }`}>
                                  {subject?.name || subId}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Availability</p>
                          <div className="space-y-1.5">
                            {availability.map((avail) => (
                              <div key={avail.day} className="flex items-center gap-2 text-xs">
                                <span className="w-20 font-medium text-slate-600 dark:text-slate-400">{avail.day}</span>
                                <select value={avail.startHour} onChange={(event) => updateAvailability(teacher.id, avail.day, 'startHour', Number(event.target.value))}
                                  className="input-base py-1 px-2 text-xs w-16">
                                  {Array.from({ length: 12 }, (_, hour) => hour + 7).map((hour) => (
                                    <option key={hour} value={hour}>{hour}:00</option>
                                  ))}
                                </select>
                                <span className="text-slate-400">to</span>
                                <select value={avail.endHour} onChange={(event) => updateAvailability(teacher.id, avail.day, 'endHour', Number(event.target.value))}
                                  className="input-base py-1 px-2 text-xs w-16">
                                  {Array.from({ length: 12 }, (_, hour) => hour + 7).map((hour) => (
                                    <option key={hour} value={hour}>{hour}:00</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {editingId && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm">
                <Zap size={14} />
                <span>Timetable will be automatically regenerated after update.</span>
              </div>
            )}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-3">
              <div className="flex justify-between"><span className="text-sm text-slate-500">Name</span><span className="text-sm font-medium text-slate-900 dark:text-white">{formName}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Period</span><span className="text-sm font-medium text-slate-900 dark:text-white">{formStartDate} → {formEndDate}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Daily Window</span><span className="text-sm font-medium text-slate-900 dark:text-white">{formDailyStartHour}:00 → {formDailyEndHour}:00</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Programmes</span><span className="text-sm font-medium text-slate-900 dark:text-white">{formProgrammeIds.length}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Teachers</span><span className="text-sm font-medium text-slate-900 dark:text-white">{formTeacherIds.length}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Subjects</span><span className="text-sm font-medium text-slate-900 dark:text-white">{selectedSubjects.length}</span></div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Programmes</p>
              <div className="flex flex-wrap gap-1.5">
                {formProgrammeIds.map((pid) => (
                  <span key={pid} className="badge-core">{getProgrammeName(pid)}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Teachers</p>
              <div className="flex flex-wrap gap-1.5">
                {formTeacherIds.map((tid) => (
                  <span key={tid} className="badge-elective">{getTeacherName(tid)}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-30"><ChevronLeft size={16} />Back</button>
          {step < 3 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="btn-primary flex items-center gap-2">Next<ChevronRight size={16} /></button>
          ) : (
            <button type="button" onClick={editingId ? handleUpdate : handleCreate} className="btn-primary">{editingId ? 'Update & Regenerate' : 'Create Vacation Class'}</button>
          )}
        </div>
      </Modal>
    </AnimatedPage>
  );
}

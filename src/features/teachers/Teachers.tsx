import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, User, Mail } from 'lucide-react';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useTeachers } from './teachers.hook';

export default function Teachers() {
  const {
    teachers, subjects, isModalOpen, editingTeacher, openCreate, openEdit, closeModal,
    handleCreate, handleEdit, handleDelete, getSubjectName, getSubjectType,
  } = useTeachers();
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubjectIds, setFormSubjectIds] = useState<string[]>([]);

  useEffect(() => {
    if (editingTeacher) {
      setFormName(editingTeacher.name);
      setFormEmail(editingTeacher.email);
      setFormSubjectIds(editingTeacher.subjectIds ?? []);
    } else {
      setFormName(''); setFormEmail(''); setFormSubjectIds([]);
    }
  }, [editingTeacher, isModalOpen]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;
    if (editingTeacher) {
      handleEdit({ id: editingTeacher.id, name: formName.trim(), email: formEmail.trim(), subjectIds: formSubjectIds });
    } else {
      handleCreate({ name: formName.trim(), email: formEmail.trim(), subjectIds: formSubjectIds });
    }
  };

  const toggleSubject = (subjectId: string) => {
    setFormSubjectIds((prev) => prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]);
  };

  return (
    <AnimatedPage>
      <PageHeader title="Teachers" description={`${teachers.length} teachers registered`}
        action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} />Add Teacher</button>} />

      {teachers.length === 0 ? (
        <EmptyState title="No teachers" description="Add your first teacher" action={<button onClick={openCreate} className="btn-primary">Add Teacher</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, index) => (
            <motion.div key={teacher.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.06 }} className="card-base p-5 group">
              {(() => {
                const teacherSubjectIds = teacher.subjectIds ?? [];
                return (
                  <>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
                    <User size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{teacher.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Mail size={11} /> {teacher.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(teacher.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(teacher.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Subjects ({teacherSubjectIds.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {teacherSubjectIds.map((subId) => (
                  <span key={subId} className={getSubjectType(subId) === 'core' ? 'badge-core' : 'badge-elective'}>{getSubjectName(subId)}</span>
                ))}
              </div>
                  </>
                );
              })()}
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'} size="lg">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <input type="text" value={formName} onChange={(event) => setFormName(event.target.value)} className="input-base" placeholder="e.g., Mr. Johnson" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input type="email" value={formEmail} onChange={(event) => setFormEmail(event.target.value)} className="input-base" placeholder="e.g., johnson@vacaclass.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subjects They Teach</label>
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((subject) => (
                <button key={subject.id} type="button" onClick={() => toggleSubject(subject.id)}
                  className={`p-3 rounded-lg text-left text-sm transition-all duration-200 border ${
                    formSubjectIds.includes(subject.id)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}>
                  {subject.name}
                  <span className={`block text-xs ${subject.type === 'core' ? 'text-indigo-500' : 'text-amber-500'}`}>{subject.type}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingTeacher ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </AnimatedPage>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Clock } from 'lucide-react';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useSubjects } from './subjects.hook';
import type { SubjectType } from '../../types';

export default function Subjects() {
  const {
    subjects,
    coreSubjects,
    electiveSubjects,
    isModalOpen,
    editingSubject,
    openCreate,
    openEdit,
    closeModal,
    handleCreate,
    handleEdit,
    handleDelete,
  } = useSubjects();

  const [formName, setFormName] = useState('');
  const [formCreditHours, setFormCreditHours] = useState(3);
  const [formType, setFormType] = useState<SubjectType>('elective');

  useEffect(() => {
    if (editingSubject) {
      setFormName(editingSubject.name);
      setFormCreditHours(editingSubject.creditHours);
      setFormType(editingSubject.type);
    } else {
      setFormName('');
      setFormCreditHours(3);
      setFormType('elective');
    }
  }, [editingSubject, isModalOpen]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formName.trim()) return;
    if (editingSubject) {
      handleEdit({ id: editingSubject.id, name: formName.trim(), creditHours: formCreditHours, type: formType });
    } else {
      handleCreate({ name: formName.trim(), creditHours: formCreditHours, type: formType });
    }
  };

  const renderSubjectCard = (subject: typeof subjects[0], index: number) => (
    <motion.div
      key={subject.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="card-base p-4 flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Clock size={16} className="text-slate-500 dark:text-slate-400" />
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{subject.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={subject.type === 'core' ? 'badge-core' : 'badge-elective'}>
              {subject.type}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {subject.creditHours} hr{subject.creditHours !== 1 ? 's' : ''}/week
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => openEdit(subject)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={() => handleDelete(subject.id)}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );

  return (
    <AnimatedPage>
      <PageHeader
        title="Subjects"
        description={`${subjects.length} subjects — ${coreSubjects.length} core, ${electiveSubjects.length} elective`}
        action={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Subject
          </button>
        }
      />

      {subjects.length === 0 ? (
        <EmptyState
          title="No subjects yet"
          description="Create your first subject to get started with the system"
          action={
            <button onClick={openCreate} className="btn-primary">
              Create Subject
            </button>
          }
        />
      ) : (
        <div className="space-y-8">
          {coreSubjects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Core Subjects
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {coreSubjects.map((subject, index) => renderSubjectCard(subject, index))}
              </div>
            </section>
          )}
          {electiveSubjects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Elective Subjects
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {electiveSubjects.map((subject, index) => renderSubjectCard(subject, index))}
              </div>
            </section>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSubject ? 'Edit Subject' : 'Create Subject'}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              value={formName}
              onChange={(event) => setFormName(event.target.value)}
              className="input-base"
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Credit Hours (per week)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={formCreditHours}
              onChange={(event) => setFormCreditHours(Number(event.target.value))}
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Type
            </label>
            <div className="flex gap-3">
              {(['core', 'elective'] as SubjectType[]).map((typeOption) => (
                <button
                  key={typeOption}
                  type="button"
                  onClick={() => setFormType(typeOption)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formType === typeOption
                      ? typeOption === 'core'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 ring-2 ring-indigo-500'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ring-2 ring-amber-500'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingSubject ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </AnimatedPage>
  );
}

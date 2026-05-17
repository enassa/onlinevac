import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Layers } from 'lucide-react';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { useProgrammes } from './programmes.hook';

export default function Programmes() {
  const {
    programmes, subjects, electiveSubjects, isModalOpen, editingProgramme,
    openCreate, openEdit, closeModal, handleCreate, handleEdit, handleDelete, getSubjectName,
  } = useProgrammes();

  const [formName, setFormName] = useState('');
  const [formElectiveIds, setFormElectiveIds] = useState<string[]>([]);

  useEffect(() => {
    if (editingProgramme) {
      setFormName(editingProgramme.name);
      setFormElectiveIds(editingProgramme.electiveSubjectIds ?? []);
    } else {
      setFormName('');
      setFormElectiveIds([]);
    }
  }, [editingProgramme, isModalOpen]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formName.trim()) return;
    const coreSubjectIds = subjects.filter((sub) => sub.type === 'core').map((sub) => sub.id);
    if (editingProgramme) {
      handleEdit({ id: editingProgramme.id, name: formName.trim(), electiveSubjectIds: formElectiveIds, coreSubjectIds: editingProgramme.coreSubjectIds ?? [] });
    } else {
      handleCreate({ name: formName.trim(), electiveSubjectIds: formElectiveIds, coreSubjectIds });
    }
  };

  const toggleElective = (subjectId: string) => {
    setFormElectiveIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  return (
    <AnimatedPage>
      <PageHeader
        title="Programmes"
        description={`${programmes.length} programmes configured`}
        action={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Programme
          </button>
        }
      />

      {programmes.length === 0 ? (
        <EmptyState title="No programmes" description="Create your first programme" action={
          <button onClick={openCreate} className="btn-primary">Create Programme</button>
        } />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((programme, index) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              className="card-base p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/40">
                    <Layers size={18} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{programme.name}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(programme.id)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(programme.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-500 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Core (auto-included)</p>
                  <div className="flex flex-wrap gap-1">
                    {(programme.coreSubjectIds ?? []).map((subId) => (
                      <span key={subId} className="badge-core">{getSubjectName(subId)}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Electives</p>
                  <div className="flex flex-wrap gap-1">
                    {(programme.electiveSubjectIds ?? []).map((subId) => (
                      <span key={subId} className="badge-elective">{getSubjectName(subId)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProgramme ? 'Edit Programme' : 'Create Programme'} size="lg">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Programme Name</label>
            <input type="text" value={formName} onChange={(event) => setFormName(event.target.value)} className="input-base" placeholder="e.g., General Science with ICT" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Elective Subjects</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Core subjects are automatically included for all programmes.</p>
            <div className="grid grid-cols-2 gap-2">
              {electiveSubjects.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleElective(subject.id)}
                  className={`p-3 rounded-lg text-left text-sm transition-all duration-200 border ${
                    formElectiveIds.includes(subject.id)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {subject.name}
                  <span className="block text-xs opacity-60">{subject.creditHours} hrs/wk</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingProgramme ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </AnimatedPage>
  );
}

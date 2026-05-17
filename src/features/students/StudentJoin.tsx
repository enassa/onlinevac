import { motion } from 'framer-motion';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import { useStudentJoin } from './students.hook';
import { subjectsApi } from '../../api';

export default function StudentJoin() {
  const { student, programmes, joinedProgramme, handleJoin } = useStudentJoin();

  return (
    <AnimatedPage>
      <PageHeader title="Join Programme" description="Select a programme to enroll in for this vacation class" />

      {joinedProgramme ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">You're enrolled in</h3>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">{joinedProgramme.name}</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Core Subjects</p>
              <div className="flex flex-wrap gap-1.5">
                {joinedProgramme.coreSubjectIds.map((subId) => (
                  <span key={subId} className="badge-core">{subjectsApi.getById(subId)?.name || subId}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Elective Subjects</p>
              <div className="flex flex-wrap gap-1.5">
                {joinedProgramme.electiveSubjectIds.map((subId) => (
                  <span key={subId} className="badge-elective">{subjectsApi.getById(subId)?.name || subId}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((programme, index) => (
            <motion.div
              key={programme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="card-base p-5 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleJoin(programme.id)}
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {programme.name}
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Core</p>
                  <div className="flex flex-wrap gap-1">
                    {programme.coreSubjectIds.slice(0, 3).map((subId) => (
                      <span key={subId} className="badge-core text-xs">{subjectsApi.getById(subId)?.name || subId}</span>
                    ))}
                    {programme.coreSubjectIds.length > 3 && <span className="text-xs text-slate-400">+{programme.coreSubjectIds.length - 3}</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Electives</p>
                  <div className="flex flex-wrap gap-1">
                    {programme.electiveSubjectIds.map((subId) => (
                      <span key={subId} className="badge-elective text-xs">{subjectsApi.getById(subId)?.name || subId}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full btn-secondary text-sm group-hover:btn-primary">
                Join Programme
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}

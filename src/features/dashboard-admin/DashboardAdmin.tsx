import { BookOpen, Layers, Users, Calendar, GraduationCap } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import AnimatedPage from '../../components/ui/AnimatedPage';
import PageHeader from '../../components/ui/PageHeader';
import { useDashboardAdmin } from './dashboardAdmin.hook';

export default function DashboardAdmin() {
  const { subjects, programmes, teachers, vacationClasses, students, activeClasses, coreCount, electiveCount } = useDashboardAdmin();

  return (
    <AnimatedPage>
      <PageHeader title="Admin Dashboard" description="System overview and statistics" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
        <StatCard label="Subjects" value={subjects.length} icon={BookOpen} color="indigo" index={0} />
        <StatCard label="Programmes" value={programmes.length} icon={Layers} color="violet" index={1} />
        <StatCard label="Teachers" value={teachers.length} icon={Users} color="emerald" index={2} />
        <StatCard label="Active Classes" value={activeClasses} icon={Calendar} color="amber" index={3} />
        <StatCard label="Students" value={students.length} icon={GraduationCap} color="sky" index={4} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-base p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Subject Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700 dark:text-slate-300">Core Subjects</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{coreCount}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(coreCount / subjects.length) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-700 dark:text-slate-300">Elective Subjects</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{electiveCount}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(electiveCount / subjects.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="card-base p-6">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Vacation Classes</h3>
          <div className="space-y-3">
            {vacationClasses.length === 0 ? (
              <p className="text-sm text-slate-500">No vacation classes yet.</p>
            ) : (
              vacationClasses.map((vacationClass) => (
                <div key={vacationClass.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{vacationClass.name}</p>
                    <p className="text-xs text-slate-500">{vacationClass.programmeIds.length} programmes · {vacationClass.teacherIds.length} teachers</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    vacationClass.status === 'active' ? 'badge-active' : vacationClass.status === 'draft' ? 'badge-draft' : 'badge-completed'
                  }`}>{vacationClass.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

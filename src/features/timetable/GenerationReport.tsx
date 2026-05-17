import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, X } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import type { SchedulerReport } from './scheduler';

interface GenerationReportProps {
  report: SchedulerReport;
  onClose: () => void;
}

export default function GenerationReport({ report, onClose }: GenerationReportProps) {
  const programmes = useAppSelector((state) => state.programmes.items);
  const pct = report.fulfillmentPercentage;
  const pctColor = pct === 100 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 75 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-1"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Generation Report
        </h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
          <X size={16} />
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="text-center">
          <div className={`text-3xl font-bold ${pctColor}`}>{pct}%</div>
          <div className="text-xs text-slate-500 mt-1">Fulfillment</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {report.totalCreditHoursPlaced}<span className="text-lg text-slate-400">/{report.totalCreditHoursRequired}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Credit Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{report.totalSubjectsFullyFulfilled}</div>
          <div className="text-xs text-slate-500 mt-1">Fully Placed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {report.totalSubjectsPartiallyFulfilled + report.totalSubjectsMissing}
          </div>
          <div className="text-xs text-slate-500 mt-1">Issues</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : pct >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
        />
      </div>

      {/* Subject breakdown */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Subject Breakdown</h4>
        <div className="space-y-2">
          {report.subjects.map((subjectReport) => {
            const isOverplaced = subjectReport.placedHours > subjectReport.requiredHours;
            const statusIcon = subjectReport.fulfilled
              ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
              : isOverplaced
                ? <TrendingUp size={14} className="text-orange-500 shrink-0" />
                : subjectReport.placedHours > 0
                  ? <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                  : <XCircle size={14} className="text-red-500 shrink-0" />;

            const programmeNames = subjectReport.programmeIds
              .map((pid) => programmes.find((prog) => prog.id === pid)?.name || '')
              .filter(Boolean)
              .join(', ');

            return (
              <div key={subjectReport.subjectId} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                {statusIcon}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {subjectReport.subjectName}
                    </span>
                    <span className={subjectReport.subjectType === 'core' ? 'badge-core' : 'badge-elective'}>
                      {subjectReport.subjectType}
                    </span>
                  </div>
                  {programmeNames && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{programmeNames}</p>
                  )}
                  {(subjectReport.diagnostics.length > 0 || subjectReport.recommendations.length > 0) && !subjectReport.fulfilled && (
                    <div className="mt-2 space-y-1">
                      {subjectReport.diagnostics.slice(0, 2).map((diagnostic) => (
                        <p key={diagnostic} className="text-[11px] text-slate-500 dark:text-slate-400">{diagnostic}</p>
                      ))}
                      {subjectReport.recommendations.slice(0, 2).map((recommendation) => (
                        <p key={recommendation} className="text-[11px] font-medium text-indigo-600 dark:text-indigo-300">Recommendation: {recommendation}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-sm font-bold ${
                    subjectReport.fulfilled ? 'text-emerald-600 dark:text-emerald-400'
                      : isOverplaced ? 'text-orange-600 dark:text-orange-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {subjectReport.placedHours}/{subjectReport.requiredHours}h
                  </span>
                  {isOverplaced && (
                    <p className="text-xs text-orange-500">+{subjectReport.placedHours - subjectReport.requiredHours}h over</p>
                  )}
                  {subjectReport.shortfall > 0 && (
                    <p className="text-xs text-red-500">−{subjectReport.shortfall}h</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Programme breakdown */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Programme Coverage</h4>
        <div className="space-y-2">
          {report.programmes.map((progReport) => (
            <div key={progReport.programmeId} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{progReport.programmeName}</p>
                <p className="text-xs text-slate-400">
                  {progReport.fullyFulfilled} of {progReport.totalSubjects} fully placed
                </p>
              </div>
              <div className="flex items-center gap-2">
                {progReport.missingSubjects > 0 && (
                  <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full">
                    {progReport.missingSubjects} missing
                  </span>
                )}
                {progReport.partiallyFulfilled > 0 && (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                    {progReport.partiallyFulfilled} partial
                  </span>
                )}
                {progReport.missingSubjects === 0 && progReport.partiallyFulfilled === 0 && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                    All placed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings */}
      {report.warnings.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Warnings</h4>
          <div className="space-y-1.5">
            {report.warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

import React from 'react';
import { FullProcedure } from '../types';
import { getSpecialtyIcon } from './SpecialtyFilter';
import { Calendar, User, Hash, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface TimelineProps {
  procedures: FullProcedure[];
  onSelect: (proc: FullProcedure) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ procedures, onSelect }) => {
  if (procedures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-lg font-medium">No procedures found for this specialty.</p>
        <p className="text-sm">Try adjusting your filters or adding a new procedure.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {procedures.map((proc, index) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          key={proc.id}
          className="relative pl-12 group cursor-pointer"
          onClick={() => onSelect(proc)}
        >
          {/* Timeline Dot */}
          <div className="absolute left-0 w-10 h-10 flex items-center justify-center bg-white border-2 border-primary rounded-full z-10 group-hover:scale-110 transition-transform shadow-sm">
            <span className="text-primary">
              {getSpecialtyIcon(proc.primary_specialty.code)}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
                    {proc.primary_specialty.name}
                  </span>
                  {proc.secondary_specialties?.map(s => (
                    <span key={s.id} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      + {s.name}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                  {proc.procedure_description}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(proc.procedure_date), 'MMM dd, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {proc.provider_name}
                  </span>
                  {proc.tooth_number && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Hash className="w-3.5 h-3.5" />
                      Tooth #{proc.tooth_number}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                <span className="text-xl font-bold text-slate-900">
                  ${proc.fee.toLocaleString()}
                </span>
                <button className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
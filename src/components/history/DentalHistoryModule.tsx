import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Stethoscope, 
  Plus, 
  Calendar,
  History,
  Grid,
  Filter,
  Smile,
  Activity,
  ShieldCheck,
  Scissors,
  Baby,
  Pill,
  ChevronRight,
  User,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { FullProcedure, SpecialtyCode } from './types';
import { MOCK_PROCEDURES, SPECIALTIES } from './mockData';
import { ProcedureDetail } from './ProcedureDetail';
import { ProcedureForm } from './ProcedureForm';
import { cn } from '@/lib/utils';

const specialtyIcons: Record<SpecialtyCode, React.ReactNode> = {
  ORTHO: <Smile className="w-4 h-4" />,
  ENDO: <Activity className="w-4 h-4" />,
  PROSTHO: <ShieldCheck className="w-4 h-4" />,
  PERIO: <Stethoscope className="w-4 h-4" />,
  OS: <Scissors className="w-4 h-4" />,
  PEDO: <Baby className="w-4 h-4" />,
  OM: <Pill className="w-4 h-4" />,
  GEN: <Grid className="w-4 h-4" />,
};

export function DentalHistoryModule() {
  const [procedures, setProcedures] = useState<FullProcedure[]>(MOCK_PROCEDURES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | 'all'>('all');
  const [selectedProcedure, setSelectedProcedure] = useState<FullProcedure | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredProcedures = useMemo(() => {
    return procedures
      .filter(p => {
        const matchesFilter = selectedFilter === 'all' || p.primary_specialty_id === selectedFilter;
        const matchesSearch = p.procedure_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.procedure_code.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => new Date(b.procedure_date).getTime() - new Date(a.procedure_date).getTime());
  }, [procedures, selectedFilter, searchQuery]);

  const handleAddProcedure = (newProc: FullProcedure) => {
    setProcedures([newProc, ...procedures]);
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dental History Module</h1>
          <p className="text-slate-500 max-w-lg">Enhanced cloud-native management for specialty-specific records.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 shadow-sm">
            <Calendar className="w-4 h-4" />
            Schedule Follow-up
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-200"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Procedure
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timeline & Search */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <CardHeader className="pb-4 bg-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search procedures, CDT codes, symptoms..." 
                    className="pl-10 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm bg-white border border-slate-200 px-3 py-2 rounded-lg shrink-0">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold">{filteredProcedures.length} Procedures</span>
                </div>
              </div>
              
              <ScrollArea className="w-full mt-4">
                <div className="flex gap-2 pb-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                      selectedFilter === 'all' 
                        ? "bg-slate-900 text-white border-slate-900" 
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                    )}
                  >
                    All Specialties
                  </button>
                  {SPECIALTIES.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => setSelectedFilter(spec.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5",
                        selectedFilter === spec.id 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {specialtyIcons[spec.code]}
                      {spec.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[650px]">
                <div className="p-6">
                  {filteredProcedures.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[19px] before:h-full before:w-0.5 before:bg-slate-100">
                      {filteredProcedures.map((proc, idx) => (
                        <TimelineItem 
                          key={proc.id} 
                          proc={proc} 
                          onClick={() => setSelectedProcedure(proc)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400">
                      <History className="w-16 h-16 mx-auto mb-4 opacity-10" />
                      <p className="text-lg font-medium">No procedures found.</p>
                      <p className="text-sm">Try clearing your filters or search query.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Snapshot & Tooth Chart Context */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl shadow-blue-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-blue-100 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Clinical Context</span>
              </div>
              <CardTitle>Specialty Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-xs leading-relaxed text-blue-50">
                  This patient has history in <span className="font-bold">Endodontics</span> and <span className="font-bold">Oral Surgery</span>. 
                  Last procedure was an implant placement 32 days ago.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-70">Prosthodontics Status</span>
                  <span className="font-bold">Active Phase</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[65%]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-600" />
                Tooth-Specific History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
               <div className="grid grid-cols-4 gap-2">
                 {[8, 14, 15, 19, 31, 32].map(t => (
                   <div key={t} className="aspect-square rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-1 group hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer">
                     <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">#{t}</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   </div>
                 ))}
               </div>
               <p className="text-[10px] text-slate-400 text-center mt-4 uppercase font-bold tracking-tighter">Quick-Select Tooth Charting</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedProcedure && (
          <ProcedureDetail 
            procedure={selectedProcedure} 
            onClose={() => setSelectedProcedure(null)} 
          />
        )}
        {isFormOpen && (
          <ProcedureForm 
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleAddProcedure} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineItem({ proc, onClick }: { proc: FullProcedure, onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-10 group cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute left-0 w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-100 rounded-xl z-10 group-hover:border-blue-500 group-hover:scale-110 transition-all shadow-sm">
        <span className="text-blue-600">
          {specialtyIcons[proc.primary_specialty.code]}
        </span>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group-hover:border-blue-200 group-hover:shadow-md transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-blue-100 text-blue-600">
                {proc.primary_specialty.name}
              </Badge>
              {proc.secondary_specialties?.map(s => (
                <span key={s.id} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                  {s.name}
                </span>
              ))}
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {proc.procedure_description}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {format(new Date(proc.procedure_date), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3 h-3" />
                {proc.provider_name}
              </span>
              {proc.tooth_number && (
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Hash className="w-3 h-3" />
                  Tooth #{proc.tooth_number}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
            <span className="text-lg font-black text-slate-900">
              ${proc.fee.toLocaleString()}
            </span>
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DentalHistoryModule;
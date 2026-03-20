import React, { useState } from 'react';
import { Specialty, SpecialtyCode, FullProcedure } from './types';
import { SPECIALTIES } from './mockData';
import { X, ChevronLeft, ChevronRight, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ProcedureFormProps {
  onClose: () => void;
  onSubmit: (procedure: any) => void;
}

export const ProcedureForm: React.FC<ProcedureFormProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [formData, setFormData] = useState<Partial<FullProcedure>>({
    tooth_number: 1,
    tooth_system: 'Universal',
    procedure_date: new Date().toISOString().split('T')[0],
    fee: 0,
    notes: '',
  });

  const [specialtyData, setSpecialtyData] = useState<any>({});

  const handleNext = () => {
    if (step === 1 && !selectedSpecialty) {
      toast.error('Please select a primary specialty');
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.procedure_code || !formData.procedure_description) {
      toast.error('Common details are required');
      return;
    }
    
    const finalData = {
      ...formData,
      primary_specialty_id: selectedSpecialty?.id,
      primary_specialty: selectedSpecialty,
      specialty_data: specialtyData,
      id: Math.random().toString(36).substr(2, 9),
      provider_name: 'Dr. Sarah Wilson',
      created_at: new Date().toISOString(),
      is_archived: false,
    };
    onSubmit(finalData);
    toast.success('Clinical record saved to chain');
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Primary Specialty Selection</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SPECIALTIES.map(spec => (
          <button
            key={spec.id}
            type="button"
            onClick={() => setSelectedSpecialty(spec)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              selectedSpecialty?.id === spec.id
                ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <span className="block font-black text-slate-900 tracking-tight">{spec.name}</span>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{spec.code}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Common Procedure Parameters</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tooth Number</label>
          <input
            type="number"
            min="1"
            max="32"
            value={formData.tooth_number}
            onChange={e => setFormData({ ...formData, tooth_number: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</label>
          <input
            type="date"
            value={formData.procedure_date}
            onChange={e => setFormData({ ...formData, procedure_date: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold"
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CDT Procedure Code</label>
          <input
            type="text"
            placeholder="D3330, D6010, etc."
            value={formData.procedure_code}
            onChange={e => setFormData({ ...formData, procedure_code: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold"
          />
        </div>
        <div className="col-span-2 space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
          <input
            type="text"
            placeholder="Brief clinical description..."
            value={formData.procedure_description}
            onChange={e => setFormData({ ...formData, procedure_description: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const code = selectedSpecialty?.code;
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{selectedSpecialty?.name} Data</h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[8px] font-black tracking-widest uppercase">Department Config</span>
        </div>

        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        {code === 'ORTHO' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Malocclusion Class</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 outline-none font-bold"
                onChange={e => setSpecialtyData({ ...specialtyData, malocclusion_class: e.target.value })}
              >
                <option value="I">Class I</option>
                <option value="II">Class II</option>
                <option value="III">Class III</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase</label>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200 outline-none font-bold"
                onChange={e => setSpecialtyData({ ...specialtyData, treatment_phase: e.target.value })}
              >
                <option value="Initial">Initial</option>
                <option value="Active">Active</option>
                <option value="Finishing">Finishing</option>
                <option value="Retention">Retention</option>
              </select>
            </div>
          </div>
        )}

        {code === 'ENDO' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. of Canals</label>
              <input 
                type="number" 
                className="w-full p-3 rounded-xl border border-slate-200 outline-none font-bold"
                onChange={e => setSpecialtyData({ ...specialtyData, number_of_canals: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WL (mm)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full p-3 rounded-xl border border-slate-200 outline-none font-bold"
                onChange={e => setSpecialtyData({ ...specialtyData, working_length: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        )}

        {!['ORTHO', 'ENDO'].includes(code || '') && (
          <div className="flex flex-col items-center justify-center text-center py-4">
            <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-slate-500 text-xs font-medium">Standard clinical fields used for this specialty.</p>
          </div>
        )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Notes</label>
          <textarea
            rows={4}
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none font-medium"
            placeholder="Detailed clinical findings..."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        layout
        className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Record Entry</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm}>
          <div className="p-8 max-h-[65vh] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-slate-50/80 backdrop-blur-md flex items-center justify-between border-t border-slate-100">
            <div className="flex gap-1.5">
              {[1, 2, 3].map(s => (
                <div 
                  key={s} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    step === s ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 text-xs font-black text-slate-500 hover:bg-slate-200 rounded-xl uppercase tracking-widest transition-all"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-7 py-2.5 text-xs font-black bg-slate-900 text-white hover:bg-slate-800 rounded-xl uppercase tracking-widest transition-all shadow-lg"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-7 py-2.5 text-xs font-black bg-blue-600 text-white hover:bg-blue-700 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-200"
                >
                  Save Record
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
import React, { useState } from 'react';
import { Specialty, SpecialtyCode, FullProcedure } from '../types';
import { SPECIALTIES } from '../mockData';
import { X, ChevronLeft, ChevronRight, Check, Plus, AlertCircle } from 'lucide-react';
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
    const finalData = {
      ...formData,
      primary_specialty_id: selectedSpecialty?.id,
      primary_specialty: selectedSpecialty,
      specialty_data: specialtyData,
      id: Math.random().toString(36).substr(2, 9),
      provider_name: 'Dr. Current User',
      created_at: new Date().toISOString(),
      is_archived: false,
    };
    onSubmit(finalData);
    toast.success('Procedure recorded successfully');
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">1. Select Primary Specialty</h3>
      <div className="grid grid-cols-2 gap-3">
        {SPECIALTIES.map(spec => (
          <button
            key={spec.id}
            onClick={() => setSelectedSpecialty(spec)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedSpecialty?.id === spec.id
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <span className="block font-bold text-slate-900">{spec.name}</span>
            <span className="text-xs text-slate-500 uppercase tracking-tighter">{spec.code}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">2. Procedure Common Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Tooth Number</label>
          <input
            type="number"
            min="1"
            max="32"
            value={formData.tooth_number}
            onChange={e => setFormData({ ...formData, tooth_number: parseInt(e.target.value) })}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Procedure Date</label>
          <input
            type="date"
            value={formData.procedure_date}
            onChange={e => setFormData({ ...formData, procedure_date: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Procedure Code (CDT)</label>
          <input
            type="text"
            placeholder="e.g., D3330"
            value={formData.procedure_code}
            onChange={e => setFormData({ ...formData, procedure_code: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
          <input
            type="text"
            placeholder="e.g., Root canal therapy, molar"
            value={formData.procedure_description}
            onChange={e => setFormData({ ...formData, procedure_description: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Fee ($)</label>
          <input
            type="number"
            value={formData.fee}
            onChange={e => setFormData({ ...formData, fee: parseFloat(e.target.value) })}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const code = selectedSpecialty?.code;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">3. {selectedSpecialty?.name} Details</h3>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">REQUIRED</span>
        </div>

        {code === 'ORTHO' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Malocclusion Class</label>
              <select 
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                onChange={e => setSpecialtyData({ ...specialtyData, malocclusion_class: e.target.value })}
              >
                <option value="I">Class I</option>
                <option value="II">Class II</option>
                <option value="III">Class III</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Appliance Type</label>
              <input 
                type="text" 
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                placeholder="Fixed, Braces, etc."
                onChange={e => setSpecialtyData({ ...specialtyData, appliance_type: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Treatment Phase</label>
              <select 
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
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
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">No. of Canals</label>
              <input 
                type="number" 
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                onChange={e => setSpecialtyData({ ...specialtyData, number_of_canals: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Working Length (mm)</label>
              <input 
                type="number" 
                step="0.1"
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                onChange={e => setSpecialtyData({ ...specialtyData, working_length: parseFloat(e.target.value) })}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Obturation Material</label>
              <input 
                type="text" 
                className="w-full p-2.5 rounded-lg border border-slate-200 outline-none"
                placeholder="Gutta-percha"
                onChange={e => setSpecialtyData({ ...specialtyData, obturation_material: e.target.value })}
              />
            </div>
          </div>
        )}

        {(!code || !['ORTHO', 'ENDO', 'PROSTHO', 'PERIO', 'OS'].includes(code)) && (
          <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-slate-500 text-sm">No specific fields required for this specialty. You can proceed to summary.</p>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Clinical Notes</label>
          <textarea
            rows={4}
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            placeholder="Record clinical findings, patient reactions, etc."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        layout
        className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Add Procedure</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm}>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
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

          <div className="p-6 bg-slate-50 flex items-center justify-between">
            <div className="flex gap-1">
              {[1, 2, 3].map(s => (
                <div 
                  key={s} 
                  className={`h-1.5 w-8 rounded-full transition-all ${
                    step >= s ? 'bg-primary' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Save Procedure
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
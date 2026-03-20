import React from 'react';
import { 
  FullProcedure, 
  OrthoDetails, 
  EndoDetails, 
  ProsthoDetails, 
  PerioDetails, 
  SurgeryDetails 
} from '../types';
import { 
  X, 
  FileText, 
  Paperclip, 
  Stethoscope, 
  History,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcedureDetailProps {
  procedure: FullProcedure | null;
  onClose: () => void;
}

export const ProcedureDetail: React.FC<ProcedureDetailProps> = ({ procedure, onClose }) => {
  if (!procedure) return null;

  const renderSpecialtySpecifics = () => {
    if (!procedure.specialty_data) return null;

    switch (procedure.primary_specialty.code) {
      case 'ORTHO': {
        const data = procedure.specialty_data as OrthoDetails;
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Malocclusion Class" value={data.malocclusion_class} />
            <DetailItem label="Appliance Type" value={data.appliance_type} />
            <DetailItem label="Archwire Size" value={data.archwire_size} />
            <DetailItem label="Treatment Phase" value={data.treatment_phase} />
            <DetailItem label="Retention" value={data.retention_appliance} />
          </div>
        );
      }
      case 'ENDO': {
        const data = procedure.specialty_data as EndoDetails;
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Canals" value={data.number_of_canals.toString()} />
            <DetailItem label="Working Length" value={`${data.working_length} mm`} />
            <DetailItem label="Obturation Material" value={data.obturation_material} />
            <DetailItem label="Sealer" value={data.sealer} />
            <DetailItem label="File System" value={data.file_system} />
            <DetailItem label="Symptoms" value={data.symptoms_before} />
            <DetailItem label="Retreatment?" value={data.is_retreat ? 'Yes' : 'No'} />
          </div>
        );
      }
      case 'PROSTHO': {
        const data = procedure.specialty_data as ProsthoDetails;
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Type" value={data.prosthesis_type} />
            <DetailItem label="Material" value={data.material} />
            <DetailItem label="Shade" value={data.shade} />
            <DetailItem label="Delivery Date" value={data.delivery_date || 'TBD'} />
          </div>
        );
      }
      case 'PERIO': {
        const data = procedure.specialty_data as PerioDetails;
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Subtype" value={data.procedure_subtype} />
            <DetailItem label="Sites" value={data.sites_involved.join(', ')} />
            <DetailItem label="Graft Material" value={data.graft_material || 'N/A'} />
            <DetailItem label="Membrane Used" value={data.membrane_used ? 'Yes' : 'No'} />
          </div>
        );
      }
      case 'OS': {
        const data = procedure.specialty_data as SurgeryDetails;
        return (
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Surgery Type" value={data.surgery_type} />
            <DetailItem label="Anesthesia" value={data.anesthesia} />
            <DetailItem label="Reason" value={data.reason} />
            <DetailItem label="Follow-up" value={data.follow_up_date || 'None'} />
          </div>
        );
      }
      default:
        return <p className="text-slate-500 italic">No specialty-specific details provided.</p>;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-start justify-between z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  {procedure.primary_specialty.name}
                </span>
                {procedure.secondary_specialties?.map(s => (
                  <span key={s.id} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    {s.name}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{procedure.procedure_description}</h2>
              <p className="text-slate-500 text-sm mt-1">
                Performed by {procedure.provider_name} on {format(new Date(procedure.procedure_date), 'MMMM dd, yyyy')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-medium text-slate-500 mb-1">Tooth</span>
                <span className="text-lg font-bold text-slate-900">
                  #{procedure.tooth_number || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-medium text-slate-500 mb-1">CDT Code</span>
                <span className="text-lg font-bold text-slate-900">{procedure.procedure_code}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="block text-xs font-medium text-slate-500 mb-1">Fee</span>
                <span className="text-lg font-bold text-slate-900">${procedure.fee.toLocaleString()}</span>
              </div>
            </div>

            {/* Specialty Details Card */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span className="font-semibold text-slate-700">Specialty Specifics</span>
              </div>
              <div className="p-5">
                {renderSpecialtySpecifics()}
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-semibold text-slate-700">Clinical Notes</span>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-slate-600 leading-relaxed italic">
                "{procedure.notes || 'No clinical notes recorded.'}"
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-primary" />
                <span className="font-semibold text-slate-700">Attachments</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-video bg-slate-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group cursor-pointer hover:border-primary/50 transition-colors">
                  <Info className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500">Pre-Op X-Ray</span>
                </div>
                <div className="aspect-video bg-slate-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group cursor-pointer hover:border-primary/50 transition-colors">
                  <Info className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500">Post-Op X-Ray</span>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                Last updated {format(new Date(procedure.created_at), 'MMM dd, yyyy HH:mm')}
              </span>
              <span>ID: {procedure.id}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);
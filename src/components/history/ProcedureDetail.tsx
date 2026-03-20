import React from 'react';
import { 
  FullProcedure, 
  OrthoDetails, 
  EndoDetails, 
  ProsthoDetails, 
  PerioDetails, 
  SurgeryDetails 
} from './types';
import { 
  X, 
  FileText, 
  Paperclip, 
  Stethoscope, 
  History,
  Info,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ProcedureDetailProps {
  procedure: FullProcedure | null;
  onClose: () => void;
}

export const ProcedureDetail: React.FC<ProcedureDetailProps> = ({ procedure, onClose }) => {
  if (!procedure) return null;

  const renderSpecialtySpecifics = () => {
    if (!procedure.specialty_data) return <p className="text-slate-400 italic text-sm">No specialty-specific details provided.</p>;

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/20"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">
                {procedure.primary_specialty.name}
              </span>
              {procedure.secondary_specialties?.map(s => (
                <span key={s.id} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200">
                  {s.name}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{procedure.procedure_description}</h2>
            <div className="flex items-center gap-2 text-slate-500 text-xs mt-1 font-medium">
              <span>{procedure.provider_name}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{format(new Date(procedure.procedure_date), 'MMMM dd, yyyy')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/50">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tooth</span>
              <span className="text-xl font-black text-slate-900">
                #{procedure.tooth_number || 'N/A'}
              </span>
            </div>
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/50">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">CDT Code</span>
              <span className="text-xl font-black text-slate-900">{procedure.procedure_code}</span>
            </div>
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100/50">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fee Paid</span>
              <span className="text-xl font-black text-slate-900">${procedure.fee.toLocaleString()}</span>
            </div>
          </div>

          {/* Specialty Specific Card */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-700 text-sm tracking-tight uppercase">Specialty Parameters</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-blue-200 text-blue-700">HIPAA Secured</Badge>
            </div>
            <div className="p-6">
              {renderSpecialtySpecifics()}
            </div>
          </div>

          {/* Clinical Findings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-700 text-sm tracking-tight uppercase">Clinical Observations</span>
            </div>
            <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100 text-slate-700 leading-relaxed font-medium italic">
              "{procedure.notes || 'No clinical notes were recorded for this session.'}"
            </div>
          </div>

          {/* Digital Assets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-700 text-sm tracking-tight uppercase">Imaging & Attachments</span>
              </div>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                View All <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/3] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                <div className="p-3 bg-white rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <Info className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pre-Op Panorex</span>
              </div>
              <div className="aspect-[4/3] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                <div className="p-3 bg-white rounded-xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                  <Info className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post-Op Verification</span>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Created {format(new Date(procedure.created_at), 'MMM dd, HH:mm')}
            </span>
            <span>Record Hash: {procedure.id.slice(0, 8)}...</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
    <span className="text-sm font-bold text-slate-900">{value}</span>
  </div>
);
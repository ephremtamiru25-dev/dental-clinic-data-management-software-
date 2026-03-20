export type SpecialtyCode = 'ORTHO' | 'ENDO' | 'PROSTHO' | 'PERIO' | 'OS' | 'PEDO' | 'OM' | 'GEN';

export interface Specialty {
  id: string;
  name: string;
  code: SpecialtyCode;
  description?: string;
  is_active: boolean;
}

export interface BaseProcedure {
  id: string;
  patient_id: string;
  tooth_number?: number;
  tooth_system: 'FDI' | 'Universal';
  surfaces?: string[];
  procedure_code: string;
  procedure_description: string;
  diagnosis_code?: string;
  primary_specialty_id: string;
  procedure_date: string;
  provider_id: string;
  provider_name: string;
  fee: number;
  notes?: string;
  attachments?: string[];
  is_archived: boolean;
  created_at: string;
  secondary_specialty_ids?: string[];
}

export interface OrthoDetails {
  malocclusion_class: 'I' | 'II' | 'III';
  appliance_type: string;
  archwire_size: string;
  elastics_preset: string;
  treatment_phase: 'Initial' | 'Active' | 'Finishing' | 'Retention';
  retention_appliance: string;
  cephalometric_values?: Record<string, number>;
}

export interface EndoDetails {
  number_of_canals: number;
  working_length: number;
  obturation_material: string;
  sealer: string;
  file_system: string;
  symptoms_before: string;
  pre_op_xray_id?: string;
  post_op_xray_id?: string;
  is_retreat: boolean;
  complications?: string;
}

export interface ProsthoDetails {
  prosthesis_type: 'Crown' | 'Bridge' | 'Denture' | 'Implant' | 'Veneer';
  material: string;
  shade: string;
  implant_system?: string;
  implant_size?: string;
  delivery_date?: string;
}

export interface PerioDetails {
  procedure_subtype: 'Scaling' | 'Root Planing' | 'Graft' | 'Crown Lengthening' | 'LANAP';
  sites_involved: number[];
  graft_material?: string;
  membrane_used?: boolean;
  initial_pocket_depths?: Record<string, number>;
  final_pocket_depths?: Record<string, number>;
}

export interface SurgeryDetails {
  surgery_type: 'Extraction' | 'Biopsy' | 'Implant Placement' | 'Cyst Removal' | 'Orthognathic';
  tooth_number?: number;
  reason: string;
  anesthesia: string;
  complications?: string;
  follow_up_date?: string;
}

export type SpecialtyData = OrthoDetails | EndoDetails | ProsthoDetails | PerioDetails | SurgeryDetails;

export interface FullProcedure extends BaseProcedure {
  primary_specialty: Specialty;
  secondary_specialties?: Specialty[];
  specialty_data?: SpecialtyData;
}
import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, Activity, AlertTriangle, FileText, Plus, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ClinicalVoiceAssistant from '@/components/ai/ClinicalVoiceAssistant';
import DiagnosticCoPilot from '@/components/ai/DiagnosticCoPilot';
import CompassionateCommunication from '@/components/ai/CompassionateCommunication';

interface PatientProfileProps {
  patient: any;
  onBack: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onBack }) => {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-gray-500">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Patient List
      </Button>

      {/* Patient Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary font-bold text-xl uppercase">
            {patient?.name?.[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{patient?.name || 'Sarah Jenkins'}</h2>
              <Badge variant="outline" className="text-xs">ID: PAT-{patient?.id || '9402'}</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {patient?.age || 34} years, {patient?.gender || 'Female'}</span>
              <span className="flex items-center gap-1 font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                <AlertTriangle className="w-3 h-3" /> Latex Allergy
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Edit Profile</Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">Book Appointment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Traditional EHR Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Clinical Voice Assistant - NEW INTEGRATION */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ClinicalVoiceAssistant />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Hypertension (Controlled)</p>
                <p>• History of Type II Diabetes</p>
                <p>• Current Medications: Lisinopril, Metformin</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" /> Recent Treatments
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• 04/12/2024: Prophylaxis & Exam</p>
                <p>• 02/15/2024: Filling #14 (MO)</p>
                <p>• 11/30/2023: Emergency (Chipped #8)</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clinical Notes & Documentation</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary"><Plus className="w-4 h-4 mr-1" /> Add Note</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3 border rounded-lg bg-muted/30">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-sm">Clinical Note - Dr. Smith</span>
                      <span className="text-xs text-muted-foreground">Oct {10 + i}, 2024</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Patient presented for routine cleaning. Gingival inflammation noted in lower lingual. Encouraged better flossing technique.</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Insights & Communication */}
        <div className="space-y-6">
          {/* Diagnostic CoPilot - NEW INTEGRATION */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-700">
            <DiagnosticCoPilot />
          </div>

          {/* Compassionate Communication - NEW INTEGRATION */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-1000">
            <CompassionateCommunication />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Patient Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-slate-100 rounded-full"><Phone className="w-4 h-4 text-slate-600" /></div>
                <span>{patient?.phone || '(555) 123-4567'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-slate-100 rounded-full"><Mail className="w-4 h-4 text-slate-600" /></div>
                <span>{patient?.email || 'sarah.j@example.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-slate-100 rounded-full"><MapPin className="w-4 h-4 text-slate-600" /></div>
                <span>123 Dental Lane, Oral City, ST 12345</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Save, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const ClinicalVoiceAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [soapNotes, setSoapNotes] = useState<SOAPNote | null>(null);
  const recognitionRef = useRef<any>(null);

  // Simulation of speech to text and AI parsing
  const startRecording = () => {
    setIsRecording(true);
    setTranscript('Listening...');
    toast.info('Clinical Voice Assistant active. Please describe findings.');
    
    // Simulate real-time transcription
    setTimeout(() => setTranscript('Patient reports occasional pain in lower left molar (S). Observed 3mm cavity on tooth 19 (O). Recurrent decay diagnosed (A). Recommend composite restoration (P).'), 2000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate AI parsing into SOAP format
    setTimeout(() => {
      setSoapNotes({
        subjective: 'Patient reports sharp pain in the lower left quadrant when drinking cold liquids. Pain lasts for 10-15 seconds.',
        objective: 'Visual exam reveals deep occlusal cavity on #19. Cold test shows lingering sensitivity. 2mm periodontal pockets in the area.',
        assessment: 'Symptomatic irreversible pulpitis #19 due to deep caries.',
        plan: 'Endodontic therapy (Root Canal) for #19 followed by a core buildup and porcelain crown.'
      });
      setIsProcessing(false);
      toast.success('SOAP notes generated successfully!');
    }, 1500);
  };

  const resetAssistant = () => {
    setSoapNotes(null);
    setTranscript('');
    setIsRecording(false);
  };

  return (
    <Card className="border-primary/20 shadow-lg overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Clinical Voice Assistant
            </CardTitle>
            <CardDescription>Real-time SOAP note generation</CardDescription>
          </div>
          <div className="flex gap-2">
            {!soapNotes ? (
              <Button 
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                className="rounded-full px-4 animate-in fade-in"
              >
                {isRecording ? (
                  <><MicOff className="w-4 h-4 mr-2 animate-pulse" /> Stop & Process</>
                ) : (
                  <><Mic className="w-4 h-4 mr-2" /> Start Recording</>
                )}
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={resetAssistant}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {!soapNotes && !isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className={`p-6 rounded-full ${isRecording ? 'bg-red-50' : 'bg-slate-50'} mb-4 transition-colors`}>
                <Mic className={`w-12 h-12 ${isRecording ? 'text-red-500 animate-bounce' : 'text-slate-300'}`} />
              </div>
              <p className="text-slate-500 max-w-xs">
                {isRecording ? transcript : 'Press the button above and begin your clinical conversation. Our AI will automatically categorize your notes into SOAP format.'}
              </p>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-medium">AI is structuring your clinical notes...</p>
            </motion.div>
          )}

          {soapNotes && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-primary uppercase mb-1 block">Subjective</span>
                  <p className="text-sm text-slate-700">{soapNotes.subjective}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-primary uppercase mb-1 block">Objective</span>
                  <p className="text-sm text-slate-700">{soapNotes.objective}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-primary uppercase mb-1 block">Assessment</span>
                  <p className="text-sm text-slate-700 font-medium text-amber-900">{soapNotes.assessment}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-bold text-primary uppercase mb-1 block">Plan</span>
                  <p className="text-sm text-slate-700">{soapNotes.plan}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t gap-3">
                <Button variant="outline" className="text-slate-500">
                  Edit Notes
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => toast.success('SOAP notes saved to patient EHR')}>
                  <Save className="w-4 h-4 mr-2" /> Save to EHR
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ClinicalVoiceAssistant;
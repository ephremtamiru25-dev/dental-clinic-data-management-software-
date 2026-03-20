import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Save, FileText, Wand2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface SOAPNotes {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const VoiceAssistant: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [soapNotes, setSoapNotes] = useState<SOAPNotes | null>(null);
  const [waveform, setWaveform] = useState<number[]>([]);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setWaveform(prev => {
          const next = [...prev, Math.random() * 50 + 10].slice(-40);
          return next;
        });
        // Simulate live transcription
        const snippets = [
          "Patient reports pain in upper right quadrant...",
          "Tender to percussion on tooth #3...",
          "Visual exam shows deep occlusal decay...",
          "Likely pulpitis, recommended root canal therapy...",
        ];
        const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
        setTranscription(prev => prev + " " + randomSnippet);
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setWaveform([]);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscription('');
    setSoapNotes(null);
    toast.info("Voice Assistant active. Listening to conversation...");
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    toast.success("Recording captured. Processing clinical notes...");
    
    // Simulate LLM processing for SOAP notes
    setTimeout(() => {
      setSoapNotes({
        subjective: "Patient Michael Chen reports persistent, dull aching pain in the upper right quadrant for 3 days. Aggravated by cold and pressure. No history of recent trauma.",
        objective: "Visual examination reveals deep occlusal caries on tooth #3. Percussion test: Positive/Tender. Vitality test: Delayed response. No swelling or sinus tract noted.",
        assessment: "Symptomatic Irreversible Pulpitis #3 with Symptomatic Apical Periodontitis.",
        plan: "1. Endodontic therapy (Root Canal) for tooth #3. 2. Post and Core build-up. 3. Full ceramic crown. Patient consented to start treatment today."
      });
      setIsProcessing(false);
      toast.success("SOAP notes generated successfully!");
    }, 2500);
  };

  return (
    <Card className="border-indigo-100 shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-indigo-900">Clinical Voice Assistant</CardTitle>
              <p className="text-xs text-indigo-500 font-medium uppercase tracking-wider">AI Powered SOAP Documentation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isRecording ? "bg-red-500" : "bg-gray-300"
            )} />
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {isRecording ? "Live Listening" : "Standby"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Waveform Visualization */}
        <div className="h-20 bg-gray-900 rounded-xl flex items-center justify-center gap-1 overflow-hidden px-4">
          {waveform.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Click record to start capturing visit</span>
            </div>
          ) : (
            waveform.map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                className="w-1 bg-indigo-400 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            ))
          )}
        </div>

        {/* Action Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleToggleRecording}
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
              isRecording 
                ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-100" 
                : "bg-indigo-600 hover:bg-indigo-700 ring-4 ring-indigo-100"
            )}
            disabled={isProcessing}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-indigo-600"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-bold uppercase">Parsing conversation...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SOAP Notes Result */}
        <AnimatePresence>
          {soapNotes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-gray-100"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Generated SOAP Notes
                </h4>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                    <Wand2 className="w-3 h-3" /> Re-parse
                  </Button>
                  <Button size="sm" className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-3 h-3" /> Append to Record
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Subjective', content: soapNotes.subjective, color: 'border-blue-100 bg-blue-50/30' },
                  { label: 'Objective', content: soapNotes.objective, color: 'border-purple-100 bg-purple-50/30' },
                  { label: 'Assessment', content: soapNotes.assessment, color: 'border-amber-100 bg-amber-50/30' },
                  { label: 'Plan', content: soapNotes.plan, color: 'border-emerald-100 bg-emerald-50/30' },
                ].map((section) => (
                  <div key={section.label} className={cn("p-4 rounded-xl border", section.color)}>
                    <p className="text-[10px] font-black uppercase text-gray-500 mb-1 tracking-tighter">{section.label}</p>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{section.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
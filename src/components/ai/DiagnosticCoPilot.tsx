import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Diagnosis {
  condition: string;
  confidence: number;
  reasoning: string;
  severity: 'low' | 'medium' | 'high';
}

const DiagnosticCoPilot: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Diagnosis[] | null>(null);

  const analyzeFindings = () => {
    setIsAnalyzing(true);
    setResults(null);
    
    // Simulate AI Analysis of clinical findings
    setTimeout(() => {
      setResults([
        {
          condition: 'Bruxism (Chronic)',
          confidence: 94,
          reasoning: 'Patient exhibits significantly worn occlusal surfaces on molars and reports frequent morning headaches.',
          severity: 'medium'
        },
        {
          condition: 'Localized Periodontitis',
          confidence: 82,
          reasoning: '4-5mm pocketing observed in quadrant 2 with radiographic evidence of early bone loss.',
          severity: 'high'
        },
        {
          condition: 'Temporomandibular Disorder (TMD)',
          confidence: 65,
          reasoning: 'Limited mandibular opening and audible clicking during closing cycles.',
          severity: 'low'
        }
      ]);
      setIsAnalyzing(false);
      toast.success('AI Differential Diagnosis complete.');
    }, 2000);
  };

  return (
    <Card className="border-indigo-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-white border-b border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <CardTitle className="text-lg">Diagnostic CoPilot</CardTitle>
          </div>
          <Button 
            onClick={analyzeFindings} 
            disabled={isAnalyzing}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Analyze Clinical Data
          </Button>
        </div>
        <CardDescription>AI-driven differential diagnosis and risk assessment</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence mode="wait">
          {!results && !isAnalyzing && (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                <Info className="w-6 h-6 text-indigo-300" />
              </div>
              <p className="text-sm text-slate-500 max-w-xs">
                Ready to analyze patient history, charts, and images for potential diagnoses.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-4 py-4">
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
              <div className="h-20 bg-slate-100 rounded animate-pulse" />
              <div className="h-20 bg-slate-100 rounded animate-pulse" />
            </div>
          )}

          {results && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {results.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg border border-slate-100 bg-white hover:border-indigo-200 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                      {item.condition}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        item.severity === 'high' ? 'bg-red-100 text-red-700' :
                        item.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.severity} Risk
                      </span>
                    </h4>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {item.confidence}% Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2 leading-relaxed italic">
                    "{item.reasoning}"
                  </p>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 group-hover:px-2 transition-all">
                      Add to Treatment Plan <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-2 bg-amber-50 rounded border border-amber-100 flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-800">
                  AI suggestions are for clinical guidance only. Final diagnosis is the responsibility of the attending dentist.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default DiagnosticCoPilot;
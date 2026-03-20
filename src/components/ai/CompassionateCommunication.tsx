import React, { useState } from 'react';
import { MessageSquare, Heart, Send, Sparkles, Smile, ShieldAlert, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const anxietyLevels = [
  { label: 'Low', icon: <Smile className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Moderate', icon: <Heart className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' },
  { label: 'High (Dental Phobic)', icon: <ShieldAlert className="w-4 h-4" />, color: 'bg-red-100 text-red-700' },
];

const CompassionateCommunication: React.FC = () => {
  const [anxiety, setAnxiety] = useState('Moderate');
  const [baseMessage, setBaseMessage] = useState('Your appointment for a root canal is tomorrow at 2 PM.');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCompassionateResponse = () => {
    setIsGenerating(true);
    setGeneratedMessage('');
    
    // Simulate Dental-CCPE Framework logic
    setTimeout(() => {
      let result = '';
      if (anxiety === 'High (Dental Phobic)') {
        result = "Hi Sarah, we know coming in can feel overwhelming. We've reserved extra time for you tomorrow at 2 PM for your root canal to ensure we go at your pace. Dr. Smith will explain every step, and we have noise-canceling headphones ready. We're here to keep you safe and comfortable.";
      } else if (anxiety === 'Moderate') {
        result = "Hi Sarah, we're looking forward to seeing you tomorrow at 2 PM for your root canal. We'll make sure you're fully comfortable throughout the procedure. If you have any questions before you arrive, just let us know!";
      } else {
        result = "Hi Sarah, confirming your root canal appointment for tomorrow at 2 PM. We'll see you then!";
      }
      setGeneratedMessage(result);
      setIsGenerating(false);
      toast.success('Message optimized for patient comfort');
    }, 1200);
  };

  return (
    <Card className="border-pink-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-white border-b border-pink-100">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <CardTitle className="text-lg">Compassionate Communication</CardTitle>
        </div>
        <CardDescription>Dental-CCPE Framework optimized messaging</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Patient Anxiety Level</label>
          <div className="flex gap-2">
            {anxietyLevels.map((level) => (
              <button
                key={level.label}
                onClick={() => setAnxiety(level.label)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                  anxiety === level.label 
                    ? `${level.color} ring-2 ring-pink-200 shadow-sm` 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {level.icon}
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Base Message / Intent</label>
          <Textarea 
            placeholder="Type clinical message here..."
            className="text-sm resize-none h-20"
            value={baseMessage}
            onChange={(e) => setBaseMessage(e.target.value)}
          />
        </div>

        <Button 
          className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          onClick={generateCompassionateResponse}
          disabled={isGenerating || !baseMessage}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Optimize for Empathy
        </Button>

        <AnimatePresence>
          {generatedMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-pink-50/50 rounded-xl border border-pink-100 relative group"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-pink-400">
                  <Languages className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pr-6">
                {generatedMessage}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="bg-slate-800 text-white text-[10px] h-7">
                  <Send className="w-3 h-3 mr-1" /> Send to Patient
                </Button>
                <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => setGeneratedMessage('')}>
                  Edit
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CompassionateCommunication;
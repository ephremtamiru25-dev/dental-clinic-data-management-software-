import React, { useState } from 'react';
import { MessageSquareHeart, Send, Sparkles, User, Smile, ShieldAlert, Zap, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface CommunicationProfile {
  anxietyLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  preference: 'Detailed' | 'Concise' | 'Empathetic' | 'Clinical';
  patientName: string;
}

export const CompassionateComm: React.FC<{ patientName: string }> = ({ patientName }) => {
  const [profile, setProfile] = useState<CommunicationProfile>({
    anxietyLevel: 'Medium',
    preference: 'Empathetic',
    patientName
  });
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateResponse = () => {
    setIsGenerating(true);
    setGeneratedMessage('');
    
    // Simulate LLM generation based on profile
    setTimeout(() => {
      let msg = "";
      if (profile.anxietyLevel === 'High' || profile.anxietyLevel === 'Severe') {
        msg = `Hi ${profile.patientName}, we noticed you have an upcoming procedure. We know dental visits can feel a bit overwhelming, but we're here to support you every step of the way. We've prepared a calming environment and will move at your pace. Your comfort is our #1 priority. Would you like to discuss any specific concerns beforehand?`;
      } else if (profile.preference === 'Detailed') {
        msg = `Dear ${profile.patientName}, regarding your next visit on June 12th: We will be performing a comprehensive hygiene exam followed by localized scaling. We expect the session to last 45 minutes. Clinically, we'll focus on the minor recession we noted last time. Let us know if you have questions!`;
      } else {
        msg = `Hi ${profile.patientName}! Just a quick note to say we're looking forward to seeing you for your cleaning in 2 days. The team is ready and we'll have everything set for a smooth, efficient visit. See you soon!`;
      }
      setGeneratedMessage(msg);
      setIsGenerating(false);
      toast.success("Compassionate message generated!");
    }, 1500);
  };

  return (
    <Card className="border-indigo-100 bg-white/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-xl text-pink-600">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Compassionate Communication</CardTitle>
            <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest">Dental-CCPE Framework</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Anxiety Level
              </label>
              <div className="flex flex-wrap gap-2">
                {['Low', 'Medium', 'High', 'Severe'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setProfile({ ...profile, anxietyLevel: lvl as any })}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                      profile.anxietyLevel === lvl 
                        ? "bg-pink-600 text-white shadow-md shadow-pink-200" 
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                <Smile className="w-3 h-3" /> Communication Style
              </label>
              <div className="flex flex-wrap gap-2">
                {['Empathetic', 'Clinical', 'Detailed', 'Concise'].map((style) => (
                  <button
                    key={style}
                    onClick={() => setProfile({ ...profile, preference: style as any })}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                      profile.preference === style 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={generateResponse}
              disabled={isGenerating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2 gap-2"
            >
              {isGenerating ? <Zap className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Generate Outreach Message
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> AI Draft
            </label>
            <div className="relative min-h-[140px] bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4">
              {generatedMessage ? (
                <p className="text-sm text-gray-700 leading-relaxed italic">"{generatedMessage}"</p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-indigo-300">
                  <User className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-xs font-medium">Select parameters and generate...</p>
                </div>
              )}
            </div>
            {generatedMessage && (
              <div className="flex gap-2">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2 h-10 text-xs font-bold">
                  <Send className="w-3 h-3" /> Send via SMS/Email
                </Button>
                <Button variant="outline" className="h-10 text-xs font-bold">Edit Draft</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
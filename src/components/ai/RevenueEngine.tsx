import React, { useState } from 'react';
import { Target, TrendingUp, Users, Calendar, AlertCircle, CheckCircle2, DollarSign, ArrowRight, Zap, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const RevenueEngine: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const careGaps = [
    { id: 1, type: 'Hygiene', description: '24 patients overdue for cleaning > 6 months', value: '$4,800', urgency: 'High' },
    { id: 2, type: 'Treatment', description: '12 approved crowns not scheduled', value: '$15,600', urgency: 'Critical' },
    { id: 3, type: 'Follow-up', description: '8 post-op calls pending for today', value: 'Retention', urgency: 'Medium' },
    { id: 4, type: 'Insurance', description: '5 patients with expiring benefits (Dec 31)', value: '$2,400', urgency: 'High' },
  ];

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <Card className="border-none shadow-2xl shadow-indigo-100 bg-white overflow-hidden">
      <CardHeader className="bg-indigo-900 text-white pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Revenue Opportunity Engine</CardTitle>
              <p className="text-xs text-indigo-300 font-medium">Auto-scanning records for clinical care gaps.</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={refreshData}
            className={cn("text-indigo-300 hover:text-white hover:bg-white/10", isRefreshing && "animate-spin")}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase">Active Opportunity</span>
            </div>
            <p className="text-2xl font-black text-emerald-900">$22,800</p>
            <p className="text-xs text-emerald-600">Identified unscheduled treatment</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase">Recall Potential</span>
            </div>
            <p className="text-2xl font-black text-amber-900">49 Patients</p>
            <p className="text-xs text-amber-600">Overdue for preventative care</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" />
            Daily Care-Gap Checklist
          </h4>
          <div className="space-y-3">
            {careGaps.map((gap, i) => (
              <motion.div 
                key={gap.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-indigo-200 hover:bg-white transition-all"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                  gap.urgency === 'Critical' ? "bg-red-500" : gap.urgency === 'High' ? "bg-amber-500" : "bg-indigo-500"
                )}>
                  {gap.urgency === 'Critical' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-black uppercase tracking-tighter text-gray-400">{gap.type}</p>
                    <span className="text-xs font-bold text-indigo-600">{gap.value}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 truncate">{gap.description}</p>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl shadow-lg shadow-indigo-100 font-bold gap-2">
          <DollarSign className="w-4 h-4" /> Generate Bulk Outreach Campaign
        </Button>
      </CardContent>
    </Card>
  );
};
import React, { useState } from 'react';
import { 
  ClipboardList, 
  Beaker, 
  Tag, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck,
  ArrowRight,
  Calculator,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const TreatmentModule: React.FC = () => {
  const [view, setView] = useState<'plans' | 'lab'>('plans');

  const plans = [
    {
      id: 'TP-2024-001',
      date: '2024-05-10',
      status: 'In Progress',
      total: 2450.00,
      items: [
        { code: 'D0120', description: 'Periodic Oral Evaluation', cost: 120, status: 'Completed' },
        { code: 'D1110', description: 'Prophylaxis - Adult', cost: 180, status: 'Completed' },
        { code: 'D6010', description: 'Surgical Placement of Implant', cost: 1800, status: 'Scheduled' },
        { code: 'D6057', description: 'Custom Abutment', cost: 350, status: 'Pending' },
      ]
    },
    {
      id: 'TP-2024-002',
      date: '2024-06-01',
      status: 'Proposed',
      total: 850.00,
      items: [
        { code: 'D2740', description: 'Crown - Porcelain/Ceramic', cost: 850, status: 'Pending' },
      ]
    }
  ];

  const labOrders = [
    { id: 'LAB-9921', case: 'Crown #30', lab: 'Apex Dental Lab', sentDate: '2024-06-05', status: 'In Fabrication', expectedDate: '2024-06-15' },
    { id: 'LAB-9918', case: 'Bridge #3-5', lab: 'Summit Lab', sentDate: '2024-06-02', status: 'Dispatched', expectedDate: '2024-06-08' },
    { id: 'LAB-9888', case: 'Night Guard', lab: 'Apex Dental Lab', sentDate: '2024-05-20', status: 'Completed', expectedDate: '2024-05-30' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700';
      case 'Scheduled': return 'bg-blue-50 text-blue-700';
      case 'Pending': return 'bg-gray-100 text-gray-600';
      case 'In Fabrication': return 'bg-amber-50 text-amber-700';
      case 'Dispatched': return 'bg-indigo-50 text-indigo-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment & Labs</h1>
          <p className="text-gray-500">Manage treatment plans, CDT codes, and laboratory workflows.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('plans')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              view === 'plans' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Treatment Plans
          </button>
          <button 
            onClick={() => setView('lab')}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              view === 'lab' ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            Lab Orders
          </button>
        </div>
      </div>

      {view === 'plans' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden">
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Plan ID</p>
                      <p className="text-sm font-bold text-gray-900">{plan.id}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Date Created</p>
                      <p className="text-sm text-gray-600">{plan.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase", plan.status === 'Proposed' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700')}>
                      {plan.status}
                    </span>
                    <Button variant="ghost" size="icon"><FileText className="w-4 h-4" /></Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                        <th className="px-6 py-3">Code</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {plan.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/30">
                          <td className="px-6 py-4 text-xs font-bold text-indigo-600">{item.code}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.description}</td>
                          <td className="px-6 py-4">
                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", getStatusColor(item.status))}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">${item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50/50">
                        <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900">Total Plan Value:</td>
                        <td className="px-6 py-4 text-right text-lg font-bold text-indigo-600">${plan.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-5 h-5 text-indigo-200" />
                  <h3 className="font-bold">Quick Quote</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-indigo-200 uppercase">CDT Code Search</label>
                    <input type="text" placeholder="Enter code (e.g. D2740)" className="w-full bg-white/10 border-white/20 rounded-lg text-sm p-2 placeholder:text-white/40 text-white outline-none focus:ring-2 focus:ring-white/30" />
                  </div>
                  <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-bold">Add to Plan</Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">New Treatment Plan</p>
                <p className="text-xs text-gray-500">Create a multi-phase plan for patient review.</p>
              </div>
            </div>

            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/ea589c7d-893f-43eb-bb39-e5aab3e5dd47/treatment-planning-module-f389b9a6-1773966209070.webp" 
              alt="Treatment Plan" 
              className="rounded-2xl border border-gray-200 shadow-sm"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Active Lab Workflow</h2>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> New Lab Case</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['In Fabrication', 'Dispatched', 'Completed'].map((stage) => (
              <div key={stage} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", stage === 'In Fabrication' ? 'bg-amber-500' : stage === 'Dispatched' ? 'bg-indigo-500' : 'bg-emerald-500')} />
                    <span className="text-xs font-bold text-gray-500 uppercase">{stage}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400">{labOrders.filter(o => o.status === stage).length}</span>
                </div>
                <div className="space-y-3">
                  {labOrders.filter(o => o.status === stage).map((order) => (
                    <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-indigo-500">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{order.id}</span>
                          <span className="text-[10px] text-gray-500">{order.sentDate}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{order.case}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Beaker className="w-3 h-3" /> {order.lab}
                          </p>
                        </div>
                        <hr className="border-gray-50" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>Exp: {order.expectedDate}</span>
                          </div>
                          {stage === 'Dispatched' && <Truck className="w-3 h-3 text-indigo-500" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentModule;
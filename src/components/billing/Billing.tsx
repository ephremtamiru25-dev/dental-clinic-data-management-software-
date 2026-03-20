import React from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const invoices = [
  { id: 'INV-001', patient: 'Michael Chen', date: '2024-05-15', amount: '$450.00', status: 'Paid', method: 'Credit Card' },
  { id: 'INV-002', patient: 'Sarah Thompson', date: '2024-05-14', amount: '$1,200.00', status: 'Pending', method: 'Insurance' },
  { id: 'INV-003', patient: 'David Miller', date: '2024-05-12', amount: '$85.00', status: 'Paid', method: 'Cash' },
  { id: 'INV-004', patient: 'Elena Rodriguez', date: '2024-05-10', amount: '$320.00', status: 'Overdue', method: 'Bank Transfer' },
];

const Billing: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500">Manage practice financial records and patient billing.</p>
        </div>
        <Button className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Process Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-600 text-white border-none">
          <CardContent className="p-6">
            <p className="text-indigo-100 text-sm font-medium">Total Outstanding</p>
            <h2 className="text-3xl font-bold mt-2">$12,450.00</h2>
            <div className="flex items-center gap-2 mt-4 text-xs text-indigo-100">
              <AlertCircle className="w-4 h-4" />
              14 invoices are overdue
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm font-medium">Collected this Month</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-900">$34,820.00</h2>
            <div className="flex items-center gap-2 mt-4 text-xs text-green-600 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              +12% from last month
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm font-medium">Pending Insurance Claims</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-900">$8,900.00</h2>
            <div className="flex items-center gap-2 mt-4 text-xs text-amber-600 font-medium">
              <Clock className="w-4 h-4" />
              8 claims requiring action
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-y border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{inv.id}</td>
                    <td className="px-6 py-4 text-gray-600">{inv.patient}</td>
                    <td className="px-6 py-4 text-gray-600">{inv.date}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                        inv.status === 'Paid' ? "bg-green-50 text-green-700" : 
                        inv.status === 'Pending' ? "bg-amber-50 text-amber-700" :
                        "bg-red-50 text-red-700"
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4 text-gray-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
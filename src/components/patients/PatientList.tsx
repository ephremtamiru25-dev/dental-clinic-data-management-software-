import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const patients = [
  { id: 1, name: 'Michael Chen', age: 34, lastVisit: '2024-03-15', status: 'Active', phone: '(555) 123-4567', email: 'm.chen@example.com' },
  { id: 2, name: 'Sarah Thompson', age: 28, lastVisit: '2024-04-02', status: 'Active', phone: '(555) 234-5678', email: 's.thompson@example.com' },
  { id: 3, name: 'David Miller', age: 52, lastVisit: '2024-02-10', status: 'Inactive', phone: '(555) 345-6789', email: 'd.miller@example.com' },
  { id: 4, name: 'Elena Rodriguez', age: 41, lastVisit: '2024-05-20', status: 'Active', phone: '(555) 456-7890', email: 'e.rodriguez@example.com' },
  { id: 5, name: 'James Wilson', age: 65, lastVisit: '2024-01-05', status: 'Follow-up', phone: '(555) 567-8901', email: 'j.wilson@example.com' },
  { id: 6, name: 'Olivia Parker', age: 24, lastVisit: '2024-05-12', status: 'Active', phone: '(555) 678-9012', email: 'o.parker@example.com' },
];

interface PatientListProps {
  onPatientSelect: (patient: any) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
          <p className="text-gray-500">Manage and view patient medical records.</p>
        </div>
        <Button onClick={() => toast.success('New patient form opened')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>

      <Card className="overflow-hidden border-gray-100">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by name, ID or email..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-9">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                Filters
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-9">Export CSV</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Visit</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                    onClick={() => onPatientSelect(patient)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {patient.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.age} years • ID: #PAT-{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        patient.status === 'Active' ? "bg-emerald-50 text-emerald-700" : 
                        patient.status === 'Inactive' ? "bg-gray-100 text-gray-600" :
                        "bg-amber-50 text-amber-700"
                      )}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3 h-3 text-indigo-400" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3 text-indigo-400" />
                          {patient.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4 text-indigo-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/20">
            <p className="text-xs font-medium text-gray-500">Showing {filteredPatients.length} of {patients.length} results</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8" disabled><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" className="h-8" disabled><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientList;
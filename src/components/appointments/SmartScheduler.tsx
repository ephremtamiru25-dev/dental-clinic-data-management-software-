import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Users
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const SmartScheduler: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  const appointments = [
    { id: 1, patient: 'Michael Chen', procedure: 'Implant Placement', time: '09:00 AM', duration: '90 min', provider: 'Dr. Miller', room: 'OP-1', status: 'Confirmed' },
    { id: 2, patient: 'Sarah Thompson', procedure: 'Annual Exam', time: '10:30 AM', duration: '45 min', provider: 'Dr. Miller', room: 'OP-2', status: 'Reminded' },
    { id: 3, patient: 'David Miller', procedure: 'Root Canal', time: '11:30 AM', duration: '120 min', provider: 'Dr. Sarah', room: 'OP-1', status: 'Pending' },
    { id: 4, patient: 'Elena Rodriguez', procedure: 'Prophylaxis', time: '02:00 PM', duration: '60 min', provider: 'Hygienist Lee', room: 'HY-1', status: 'Confirmed' },
  ];

  const providers = [
    { name: 'Dr. Miller', role: 'General Dentist', status: 'Available' },
    { name: 'Dr. Sarah', role: 'Endodontist', status: 'Busy' },
    { name: 'Hygienist Lee', role: 'Lead Hygienist', status: 'Available' },
  ];

  const rooms = [
    { name: 'OP-1', type: 'Surgery', occupied: true },
    { name: 'OP-2', type: 'General', occupied: false },
    { name: 'HY-1', type: 'Hygiene', occupied: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Scheduler</h1>
          <p className="text-gray-500">Automated reminders & intelligent room assignment.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-xl mr-2">
            <Button variant="ghost" size="sm" className="rounded-lg bg-white shadow-sm">Day</Button>
            <Button variant="ghost" size="sm" className="rounded-lg">Week</Button>
            <Button variant="ghost" size="sm" className="rounded-lg">Month</Button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Availability */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Provider Status</h3>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
              <div className="space-y-3">
                {providers.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {p.name.split(' ')[1][0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.role}</p>
                    </div>
                    <span className={cn("w-1.5 h-1.5 rounded-full", p.status === 'Available' ? 'bg-green-500' : 'bg-amber-500')} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Room Utilization</h3>
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div key={room.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                      <span className="text-gray-500">{room.name} ({room.type})</span>
                      <span className={room.occupied ? "text-amber-600" : "text-emerald-600"}>
                        {room.occupied ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", room.occupied ? "bg-amber-400 w-3/4" : "bg-emerald-400 w-0")} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Reminders Sent</p>
            </div>
            <p className="text-2xl font-black text-indigo-600">42 / 45</p>
            <p className="text-[10px] text-indigo-600 mt-1">Automated SMS/Email confirmations for tomorrow completed.</p>
          </div>
        </div>

        {/* Main Schedule View */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                  <h2 className="text-sm font-bold text-gray-900">Tuesday, June 10, 2024</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-gray-100 text-[10px] font-medium text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Confirmed
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-gray-100 text-[10px] font-medium text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Time grid */}
              <div className="divide-y divide-gray-50">
                {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((time) => (
                  <div key={time} className="flex h-20 group">
                    <div className="w-20 px-3 py-2 text-[10px] font-bold text-gray-400 text-right">
                      {time}
                    </div>
                    <div className="flex-1 border-l border-gray-100 relative group-hover:bg-gray-50/30 transition-colors">
                      {/* Placeholder for appointments */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Absolute positioned appointments */}
              {appointments.map((appt) => (
                <div 
                  key={appt.id}
                  className={cn(
                    "absolute left-[80px] right-4 rounded-xl border-l-4 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer z-10",
                    appt.status === 'Confirmed' ? "bg-emerald-50 border-l-emerald-500" : 
                    appt.status === 'Reminded' ? "bg-indigo-50 border-l-indigo-500" : "bg-amber-50 border-l-amber-500",
                    appt.time === '09:00 AM' ? "top-20 h-28" : 
                    appt.time === '10:30 AM' ? "top-[240px] h-20" :
                    appt.time === '11:30 AM' ? "top-[320px] h-32" : "top-[480px] h-24"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-gray-900/60 tracking-wider">{appt.time} • {appt.duration}</span>
                        {appt.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {appt.status === 'Reminded' && <AlertCircle className="w-3 h-3 text-indigo-600" />}
                      </div>
                      <p className="text-sm font-bold text-gray-900">{appt.patient}</p>
                      <p className="text-xs text-gray-600">{appt.procedure}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                         <User className="w-3 h-3" /> {appt.provider}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase mt-1">
                         <MapPin className="w-3 h-3" /> {appt.room}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartScheduler;
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const appointments = [
  { id: 1, patient: 'John Doe', type: 'Initial Consultation', time: '09:00 AM', duration: '45 min', room: 'Room 1' },
  { id: 2, patient: 'Alice Smith', type: 'Root Canal Therapy', time: '10:30 AM', duration: '90 min', room: 'Surgery A' },
  { id: 3, patient: 'Robert Johnson', type: 'Standard Cleaning', time: '11:45 AM', duration: '30 min', room: 'Hygiene' },
  { id: 4, patient: 'Emma Wilson', type: 'Teeth Whitening', time: '02:00 PM', duration: '60 min', room: 'Room 2' },
];

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
          <p className="text-gray-500">View and manage your schedule for the week.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-100 rounded-lg p-1 flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
            <span className="px-4 text-sm font-semibold">May 20, 2024 - May 26, 2024</span>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Book
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-gray-100">
                {days.map((day) => (
                  <div key={day} className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase border-r border-gray-100 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 h-[600px]">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className={cn(
                    "border-r border-b border-gray-100 p-2 transition-colors hover:bg-gray-50/50",
                    i % 7 === 6 && "border-r-0",
                    i >= 28 && "border-b-0"
                  )}>
                    <span className="text-[10px] font-medium text-gray-400">{i + 1}</span>
                    {i === 20 && (
                      <div className="mt-1 p-1 bg-indigo-50 border-l-2 border-indigo-500 rounded text-[10px] font-semibold text-indigo-700 leading-tight">
                        4 Appts
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{apt.patient}</p>
                        <p className="text-xs text-indigo-600 font-medium">{apt.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-900">{apt.time}</p>
                        <p className="text-[10px] text-gray-500">{apt.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {apt.room}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <User className="w-3 h-3" />
                        Dr. Miller
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
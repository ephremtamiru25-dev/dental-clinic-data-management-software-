import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Sparkles } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import RevenueOpportunityEngine from '@/components/ai/RevenueOpportunityEngine';

interface OverviewProps {
  onPatientSelect: (patient: any) => void;
}

const data = [
  { name: 'Mon', revenue: 4200, patients: 12 },
  { name: 'Tue', revenue: 5800, patients: 15 },
  { name: 'Wed', revenue: 3900, patients: 10 },
  { name: 'Thu', revenue: 6100, patients: 18 },
  { name: 'Fri', revenue: 4800, patients: 14 },
];

const stats = [
  { title: 'Total Revenue', value: '$24,800', change: '+12.5%', icon: DollarSign, trend: 'up' },
  { title: 'New Patients', value: '24', change: '+18%', icon: Users, trend: 'up' },
  { title: 'Appts Filled', value: '92%', change: '-2%', icon: Calendar, trend: 'down' },
  { title: 'Case Acceptance', value: '68%', change: '+5%', icon: Activity, trend: 'up' },
];

const Overview: React.FC<OverviewProps> = ({ onPatientSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back, Dr. Sterling. Here's your practice at a glance.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary">AI Revenue Insights Active</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Daily performance for the current week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Opportunity Engine - NEW INTEGRATION */}
        <div className="md:col-span-3">
          <RevenueOpportunityEngine />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors" onClick={() => onPatientSelect({ id: i, name: 'Sarah Jenkins', phone: '(555) 123-4567', email: 'sarah.j@example.com', age: 34, gender: 'Female' })}>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Patient Check-in: Sarah Jenkins</p>
                    <p className="text-xs text-muted-foreground">Arrived 15 mins early for Hygiene Appt</p>
                  </div>
                  <div className="text-xs text-muted-foreground">10:45 AM</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="rounded-xl overflow-hidden border shadow-sm relative group h-full min-h-[250px]">
           <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/ea589c7d-893f-43eb-bb39-e5aab3e5dd47/revenue-opportunity-dashboard-205ff076-1773967210484.webp" 
              alt="Revenue Dashboard" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-xl">Advanced Practice Intelligence</h3>
              <p className="text-white/80 text-sm">Leveraging Agentic AI to identify care gaps and optimize clinic revenue.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
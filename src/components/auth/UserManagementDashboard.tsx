import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { UserPlus, Search, UserCog, Mail, Shield, UserX, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_USERS = [
  { id: '1', employee_id: 'D12345', email: 'dr.smith@dentalos.com', role: 'Dentist', status: 'Active' },
  { id: '2', employee_id: 'H22334', email: 'jane.hygiene@dentalos.com', role: 'Hygienist', status: 'Active' },
  { id: '3', employee_id: 'F55443', email: 'bob.front@dentalos.com', role: 'FrontDesk', status: 'Inactive' },
];

export const UserManagementDashboard: React.FC = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
    toast.success('User status updated');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Feature: Add User Invite Sent');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">Manage employees, roles, and system access.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" /> Add New Staff
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Employee Directory</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by ID or email..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 text-left font-medium">Employee ID</th>
                    <th className="p-3 text-left font-medium">Email</th>
                    <th className="p-3 text-left font-medium">Role</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium">{user.employee_id}</td>
                      <td className="p-3 text-muted-foreground">{user.email}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="gap-1">
                          <Shield className="w-3 h-3" /> {user.role}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'} className="rounded-full">
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Edit Permissions">
                            <UserCog className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            onClick={() => toggleStatus(user.id)}
                            className={user.status === 'Active' ? 'text-destructive' : 'text-primary'}
                          >
                            {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite New User</CardTitle>
            <CardDescription>Send an invitation to a new staff member.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_email">Email Address</Label>
                <Input id="new_email" type="email" placeholder="staff@dentalos.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_role">Assigned Role</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Dentist">Dentist</SelectItem>
                    <SelectItem value="Hygienist">Hygienist</SelectItem>
                    <SelectItem value="FrontDesk">Front Desk</SelectItem>
                    <SelectItem value="LabTech">Lab Technician</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_id">Employee ID</Label>
                <Input id="new_id" placeholder="e.g. D10001" required />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Mail className="w-4 h-4" /> Send Invitation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Shield, Lock, Smartphone, Fingerprint, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleToggleMFA = () => {
    setMfaEnabled(!mfaEnabled);
    toast.info(`MFA ${!mfaEnabled ? 'Enabled' : 'Disabled'}`);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">{user.employee_id.charAt(0)}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.employee_id}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="w-3 h-3" /> {user.role}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              {mfaEnabled ? <Shield className="w-3 h-3 text-green-500" /> : <Lock className="w-3 h-3 text-yellow-500" />}
              MFA: {mfaEnabled ? 'Protected' : 'Standard'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Update your password and security preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input 
                  id="current_password" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input 
                  id="new_password" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input 
                  id="confirm_password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">Use an app like Google Authenticator or Authy.</p>
              </div>
              <Button 
                variant={mfaEnabled ? "outline" : "default"} 
                size="sm"
                onClick={handleToggleMFA}
              >
                {mfaEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50">
              <div className="p-2 bg-white rounded-md shadow-sm">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Recovery Codes</p>
                <p className="text-sm text-muted-foreground">Generated backup codes for emergency access.</p>
              </div>
              <Button variant="ghost" size="sm" disabled={!mfaEnabled}>View Codes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Granted Permissions</CardTitle>
          <CardDescription>The following actions are authorized for your role.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((perm, idx) => (
              <Badge key={idx} variant="outline" className="bg-slate-50">
                {perm}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
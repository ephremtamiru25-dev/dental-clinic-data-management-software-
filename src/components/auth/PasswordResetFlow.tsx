import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PasswordResetFlow: React.FC = () => {
  const [step, setStep] = useState<'request' | 'sent'>('request');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('sent');
    toast.success('Reset link sent to your email');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
              {step === 'request' ? <Mail className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8 text-green-500" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'request' ? 'Reset Password' : 'Email Sent'}
          </CardTitle>
          <CardDescription>
            {step === 'request' 
              ? 'Enter your email address and we will send you a link to reset your password.'
              : `We've sent a password reset link to ${email}. Check your inbox.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset_email">Email Address</Label>
                <Input 
                  id="reset_email" 
                  type="email" 
                  placeholder="name@dentalos.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setStep('request')}>
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={() => navigate('/login')}>
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
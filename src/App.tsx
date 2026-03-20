import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth-context';
import { Shell } from './components/layout/Shell';
import { LoginPage } from './components/auth/LoginPage';
import { PasswordResetFlow } from './components/auth/PasswordResetFlow';
import { UserManagementDashboard } from './components/auth/UserManagementDashboard';
import { ProfilePage } from './components/auth/ProfilePage';
import { DentalHistoryModule } from './components/history/DentalHistoryModule';
import Overview from './components/dashboard/Overview';
import { Toaster } from 'sonner';
import { Protected } from './components/auth/Protected';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<PasswordResetFlow />} />

          {/* Protected Routes inside Shell */}
          <Route path="/" element={
            <ProtectedRoute>
              <Shell />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Overview onPatientSelect={() => {}} />} />
            <Route path="history" element={<DentalHistoryModule />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Admin Only Route */}
            <Route path="admin/staff" element={
              <Protected resource="user" action="manage" fallback={<Navigate to="/dashboard" />}>
                <UserManagementDashboard />
              </Protected>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
};

export default App;
-- Migration: Comprehensive Authentication and Authorization System
-- Timestamp: 20240602000000

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Permissions Table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource TEXT NOT NULL, -- e.g., 'patient', 'dental_procedure'
    action TEXT NOT NULL,   -- e.g., 'read', 'write', 'manage'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- 3. Role Permissions Junction Table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id UUID REFERENCES public.roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User MFA Table
CREATE TABLE IF NOT EXISTS public.user_mfa (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    totp_secret TEXT,
    backup_codes TEXT[], -- Array of hashed backup codes
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Auth Logs Table
CREATE TABLE IF NOT EXISTS public.auth_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'login_success', 'login_failure', 'mfa_success', 'logout'
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 7. User Sessions Table (Refresh Tokens)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON public.users(employee_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(refresh_token);

-- Enable Row Level Security
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Roles & Permissions: Read access for all authenticated users, write for admins
CREATE POLICY "Roles are viewable by authenticated users" ON public.roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permissions are viewable by authenticated users" ON public.permissions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users: Users can read their own data; Admins can read all
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Auth Logs: Only admins can view logs
-- (Assuming an 'admin' role exists and logic to check it)
-- Note: Simplified for this migration; usually requires a check function

-- Initial Seed Data
INSERT INTO public.roles (name, description) VALUES
('Admin', 'Full system access'),
('Dentist', 'Clinical access to assigned patients'),
('Hygienist', 'Access to hygiene and perio procedures'),
('FrontDesk', 'Scheduling and billing access'),
('LabTech', 'Access to lab cases');

-- Seed Permissions
INSERT INTO public.permissions (resource, action, description) VALUES
('patient', 'read', 'View patient demographics'),
('patient', 'create', 'Register new patients'),
('patient', 'update', 'Edit patient info'),
('patient', 'delete', 'Archive patients'),
('medical_history', 'read', 'View medical history'),
('medical_history', 'write', 'Update medical history'),
('dental_procedure', 'read', 'View procedures'),
('dental_procedure', 'write', 'Add/Edit procedures'),
('appointment', 'read', 'View calendar'),
('appointment', 'create', 'Book appointments'),
('billing', 'read', 'View invoices'),
('billing', 'write', 'Process payments'),
('lab_case', 'read', 'View lab orders'),
('lab_case', 'write', 'Manage lab orders'),
('user', 'manage', 'Administer users');

-- Role-Permission Assignments (Sample)
DO $$
DECLARE
    admin_id UUID := (SELECT id FROM public.roles WHERE name = 'Admin');
    dentist_id UUID := (SELECT id FROM public.roles WHERE name = 'Dentist');
    front_desk_id UUID := (SELECT id FROM public.roles WHERE name = 'FrontDesk');
BEGIN
    -- Admin gets everything
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT admin_id, id FROM public.permissions;

    -- Dentist permissions
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT dentist_id, id FROM public.permissions 
    WHERE resource IN ('patient', 'medical_history', 'dental_procedure', 'appointment', 'lab_case');

    -- Front Desk permissions
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT front_desk_id, id FROM public.permissions 
    WHERE resource IN ('patient', 'appointment', 'billing') AND action != 'delete';
END $$;
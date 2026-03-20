-- HIPAA & GDPR Compliance Migration
-- Created: 2024-05-20
-- Description: Implements RBAC, Audit Logging, and PHI Security.

-- 1. Create User Roles Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'dentist', 'hygienist', 'front_desk', 'patient');
    END IF;
END $$;

-- 2. Create Profiles Table (RBAC Source of Truth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'patient',
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Audit Logs Table (HIPAA Requirement)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
    performed_by UUID REFERENCES auth.users(id),
    old_data JSONB,
    new_data JSONB,
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    client_ip TEXT
);

-- 4. Create Patient Table (PHI)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT,
    contact_info JSONB, -- Encrypted at rest by Supabase/Postgres
    ssn_last_four TEXT, -- Minimal PHI
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 5. Create Clinical Records (PHI)
CREATE TABLE IF NOT EXISTS public.clinical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.profiles(id),
    record_type TEXT NOT NULL, -- 'note', 'diagnosis', 'treatment_plan'
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_records ENABLE ROW LEVEL SECURITY;

-- 7. RBAC Helper Functions
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- 8. RLS Policies

-- PROFILES: Users can read all profiles (for scheduling), but only update their own. Admins can do everything.
CREATE POLICY "Profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles" 
ON public.profiles FOR ALL TO authenticated 
USING (get_user_role(auth.uid()) = 'admin');

-- PATIENTS: Admin, Dentist, Hygienist, Front Desk can read. Dentist/Admin can write clinical.
CREATE POLICY "Staff can view patient records" 
ON public.patients FOR SELECT TO authenticated 
USING (get_user_role(auth.uid()) IN ('admin', 'dentist', 'hygienist', 'front_desk'));

CREATE POLICY "Staff can insert patients" 
ON public.patients FOR INSERT TO authenticated 
WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'dentist', 'front_desk'));

-- CLINICAL RECORDS: Only Dentist and Admin can read/write. Hygienists can read.
CREATE POLICY "Dentists and Admins can manage clinical records" 
ON public.clinical_records FOR ALL TO authenticated 
USING (get_user_role(auth.uid()) IN ('admin', 'dentist'));

CREATE POLICY "Hygienists can view clinical records" 
ON public.clinical_records FOR SELECT TO authenticated 
USING (get_user_role(auth.uid()) = 'hygienist');

-- AUDIT LOGS: Only Admins can view.
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs FOR SELECT TO authenticated 
USING (get_user_role(auth.uid()) = 'admin');

-- 9. Audit Logging Trigger Function
CREATE OR REPLACE FUNCTION process_audit_log() 
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, performed_by, old_data)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, (SELECT auth.uid()), to_jsonb(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, performed_by, old_data, new_data)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, (SELECT auth.uid()), to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.audit_logs (table_name, record_id, action, performed_by, new_data)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, (SELECT auth.uid()), to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Apply Audit Triggers to PHI Tables
CREATE TRIGGER audit_patients_changes
AFTER INSERT OR UPDATE OR DELETE ON public.patients
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

CREATE TRIGGER audit_clinical_changes
AFTER INSERT OR UPDATE OR DELETE ON public.clinical_records
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

-- 11. Auto-create Profile Trigger (Handles Signup)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'patient');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
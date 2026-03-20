-- Update Migration: Adding Patient Providers for RLS
-- Timestamp: 20240602000001

-- 8. Patient Providers Table (Assignment mapping)
CREATE TABLE IF NOT EXISTS public.patient_providers (
    patient_id UUID NOT NULL, -- Link to patients table (assuming it exists)
    provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    relationship_type TEXT, -- e.g., 'Primary', 'Referred'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (patient_id, provider_id)
);

-- Index for RLS lookups
CREATE INDEX IF NOT EXISTS idx_patient_providers_provider ON public.patient_providers(provider_id);
CREATE INDEX IF NOT EXISTS idx_patient_providers_patient ON public.patient_providers(patient_id);

-- Enable RLS
ALTER TABLE public.patient_providers ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins or the specific provider can see these links
CREATE POLICY "Providers can view their own patient assignments" ON public.patient_providers
    FOR SELECT USING (auth.uid() = provider_id);
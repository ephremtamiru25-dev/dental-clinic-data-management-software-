-- Dental History Module Schema (PostgreSQL)
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE condition_severity AS ENUM ('Low', 'Moderate', 'High', 'Critical');
CREATE TYPE smoking_status AS ENUM ('Never', 'Former', 'Current', 'Smoker (Freq Unknown)');
CREATE TYPE alcohol_use AS ENUM ('None', 'Occasional', 'Moderate', 'Heavy');
CREATE TYPE relation_type AS ENUM ('Mother', 'Father', 'Sibling', 'Grandparent', 'Other');
CREATE TYPE attachment_type AS ENUM ('xray', 'photo', 'scan', 'document');

-- Tables
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    dob DATE NOT NULL,
    contact_info JSONB NOT NULL, -- Encrypted using pgcrypto in application logic or DB
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT,
    condition TEXT NOT NULL, -- ICD-10/SNODENT coded
    diagnosis_date DATE,
    notes TEXT,
    severity condition_severity DEFAULT 'Moderate',
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID, -- Ref to Auth User
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dental_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT,
    tooth_number INTEGER,
    procedure_type TEXT NOT NULL, -- CDT coded
    procedure_date DATE NOT NULL,
    provider TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT UNIQUE,
    smoking_status smoking_status DEFAULT 'Never',
    alcohol_use alcohol_use DEFAULT 'None',
    diet_notes TEXT,
    occupation TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS family_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT,
    relation relation_type NOT NULL,
    condition TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visit_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    provider_id UUID NOT NULL,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    tooth_numbers INTEGER[],
    procedure_codes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(subjective, '') || ' ' || coalesce(objective, '') || ' ' || coalesce(assessment, '') || ' ' || coalesce(plan, ''))
    ) STORED
);

CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE RESTRICT,
    file_url TEXT NOT NULL,
    type attachment_type NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    tags TEXT[]
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_visit_notes_search ON visit_notes USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_patient_medical ON medical_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_dental ON dental_history(patient_id);
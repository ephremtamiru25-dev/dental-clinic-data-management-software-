# Dental History Module - Integration & Implementation Roadmap

## 1. AI Integration Guidelines

### Voice Assistant for SOAP Generation
- **Service**: Integration with OpenAI Whisper or AWS Transcribe Medical.
- **Workflow**:
  1. Capture audio during dental visit via PWA frontend.
  2. Stream audio to FastAPI endpoint `/api/ai/transcribe`.
  3. Send transcript to LLM (GPT-4o) with prompt: 
     *"Extract Subjective, Objective, Assessment, and Plan from the following dentist-patient conversation. Use professional dental terminology. Format as JSON."*
  4. Return structured JSON to UI for clinician review before saving.

### History Summarization (Snapshot)
- **Prompting Strategy**:
  *"Summarize the last 2 years of history for this patient. Focus on: 1. Active medical conditions, 2. Critical allergies, 3. Recent procedures, 4. Trends in periodontal health. Keep it under 100 words."*

---

## 2. Security & Compliance Measures

### Data Protection
- **Encryption at Rest**: Sensitive columns like `contact_info` and `social_history` are encrypted using PostgreSQL `pgcrypto` with a pepper managed by AWS Secrets Manager.
- **Encryption in Transit**: Forced TLS 1.3 for all API communication.

### Audit Logging
- Every transaction on history tables triggers a row in the `audit_logs` table via database triggers or FastAPI middleware.
- Fields tracked: `timestamp`, `user_id`, `action`, `old_value`, `new_value`.

### RBAC
- **Dentist**: Full access to all history and notes.
- **Hygienist**: Access to medical alerts, dental history, and perio-related notes.
- **Front Desk**: View-only for medical alerts (for safety) and social history.

---

## 3. UX Specifications

### Timeline View
- Chronological vertical list with color-coded categories.
- Filters by tooth number (visual tooth chart selection) to see all history related to a specific tooth.
- Infinite scroll for long patient records.

### Offline Support
- Uses Service Workers and IndexedDB to cache the last 5 searched patients' history records.
- SOAP notes entered offline are queued in Background Sync and pushed when connectivity is restored.

---

## 4. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Deploy PostgreSQL schema with history and SOAP tables.
- Implement basic FastAPI CRUD for medical/dental history.
- Build the Timeline UI with static filtering.

### Phase 2: Clinical Workflow (Weeks 3-4)
- Implement SOAP Note entry form with structured fields.
- Integration of CDT and ICD-10 search within the forms.
- File attachment support (S3 integration).

### Phase 3: AI & Search (Weeks 5-6)
- Enable PostgreSQL Full-Text Search across clinical notes.
- Integration of Voice-to-SOAP assistant using Whisper.
- AI Snapshot generation service.

### Phase 4: Interoperability (Weeks 7-8)
- FHIR (Fast Healthcare Interoperability Resources) mapping for patient history.
- Export modules for patient data requests (JSON/CSV).
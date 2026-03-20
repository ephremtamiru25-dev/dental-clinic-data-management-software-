import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Mock Data
const mockPatients = [
  { id: '1', resourceType: 'Patient', name: [{ family: 'Doe', given: ['John'] }], gender: 'male', birthDate: '1985-05-15' },
  { id: '2', resourceType: 'Patient', name: [{ family: 'Smith', given: ['Jane'] }], gender: 'female', birthDate: '1990-10-22' }
];

const mockAppointments = [
  { id: '101', resourceType: 'Appointment', status: 'booked', start: '2024-06-01T10:00:00Z', end: '2024-06-01T11:00:00Z' }
];

// FHIR Patient Endpoints
app.get('/api/v1/fhir/Patient', (req: Request, res: Response) => {
  res.json({
    resourceType: 'Bundle',
    type: 'searchset',
    total: mockPatients.length,
    entry: mockPatients.map(p => ({ resource: p }))
  });
});

app.post('/api/v1/fhir/Patient', (req: Request, res: Response) => {
  const newPatient = { id: Math.random().toString(36).substr(2, 9), ...req.body };
  mockPatients.push(newPatient);
  res.status(201).json(newPatient);
});

// FHIR Appointment Endpoints
app.get('/api/v1/fhir/Appointment', (req: Request, res: Response) => {
  res.json({
    resourceType: 'Bundle',
    type: 'searchset',
    total: mockAppointments.length,
    entry: mockAppointments.map(a => ({ resource: a }))
  });
});

// Cancellation Endpoint with Webhook Trigger
app.post('/api/v1/appointments/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const appointment = mockAppointments.find(a => a.id === id);
  
  if (appointment) {
    appointment.status = 'cancelled';
    
    // Simulate Webhook dispatch
    console.log(`[WEBHOOK] Dispatching appointment.cancelled for appointment ${id}`);
    
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// Data Export Endpoints
app.get('/api/v1/export/data', (req: Request, res: Response) => {
  const { resource, format } = req.query;
  
  let data: any = [];
  if (resource === 'patients') data = mockPatients;
  else if (resource === 'appointments') data = mockAppointments;
  else data = { patients: mockPatients, appointments: mockAppointments };

  if (format === 'csv') {
    // Simple mock CSV generation
    const csv = typeof data === 'object' && !Array.isArray(data) 
      ? 'Exporting all data to CSV is a background process. You will receive an email.' 
      : 'ID,Name,Type
' + data.map((item: any) => `${item.id},${item.name?.[0]?.family || 'N/A'},${item.resourceType}`).join('
');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
    return res.send(csv);
  }

  res.json(data);
});

// Webhook Subscription
app.post('/api/v1/webhooks/subscriptions', (req: Request, res: Response) => {
  const { url, events } = req.body;
  console.log(`[WEBHOOK] New subscription: ${url} for events: ${events.join(', ')}`);
  res.status(201).json({ message: 'Subscription registered', id: 'sub_123' });
});

// Clinical AI Endpoints
app.post('/api/v1/clinical/soap-notes', (req: Request, res: Response) => {
  const { transcript } = req.body;
  // Mock AI response
  res.json({
    subjective: "Patient reports tooth sensitivity in upper right quadrant.",
    objective: "Examination reveals enamel wear on molar #3.",
    assessment: "Moderate bruxism with localized sensitivity.",
    plan: "Recommended nighttime mouthguard and sensitivity toothpaste."
  });
});

// Serve OpenAPI Spec
app.get('/openapi.yaml', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'openapi.yaml');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/yaml');
    res.send(fs.readFileSync(filePath, 'utf8'));
  } else {
    res.status(404).send('OpenAPI specification not found.');
  }
});

app.listen(PORT, () => {
  console.log(`DentalOS API Server running on http://localhost:${PORT}`);
});
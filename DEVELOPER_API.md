# DentalOS Developer API Guide

Welcome to the DentalOS API documentation. Our system is built with an **API-first** philosophy, ensuring that third-party developers, healthcare partners, and practice owners have full access to their data and can build powerful integrations.

## Core Principles
- **FHIR R4 Compatible**: We use the HL7 FHIR (Fast Healthcare Interoperability Resources) standard for all clinical and patient data exchange.
- **Real-time Webhooks**: Stay in sync with practice events using our robust webhook system.
- **No Vendor Lock-in**: Full data export in JSON and CSV formats is available at any time.
- **RESTful Design**: Standard HTTP methods and status codes.

## Getting Started

The full API specification is available in the `openapi.yaml` file in the root of the project. You can load this into Swagger UI, Postman, or any OpenAPI-compatible tool.

### Authentication
All requests require a Bearer Token in the Authorization header:
```bash
Authorization: Bearer <your_api_key>
```

## FHIR Resources

### Patients
Manage patient records using the FHIR Patient resource.
- **Endpoint**: `GET /api/v1/fhir/Patient`
- **Supported Search Params**: `name`, `identifier`, `birthdate`, `gender`.

### Appointments
Manage the practice schedule.
- **Endpoint**: `GET /api/v1/fhir/Appointment`
- **Cancellation**: `POST /api/v1/appointments/{id}/cancel` triggers a real-time webhook.

## Webhooks

Subscribe to real-time events to build custom automation (e.g., custom SMS reminders, external business intelligence).

### Event Types
- `appointment.cancelled`: Dispatched when an appointment is removed from the schedule.
- `patient.created`: Dispatched when a new patient record is added.
- `billing.paid`: Dispatched when an invoice is fully settled.

### Registering a Webhook
```bash
POST /api/v1/webhooks/subscriptions
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/dentalos",
  "events": ["appointment.cancelled"]
}
```

## Data Portability (Anti-Lock-in)

We believe you should always own your data. You can export your entire database at any time.

### Bulk Export
- **JSON Export**: `GET /api/v1/export/data?resource=all&format=json`
- **CSV Export**: `GET /api/v1/export/data?resource=all&format=csv`

For large datasets, the export will be processed in the background and a download link will be sent to the registered administrator email.

## API Specification
For the detailed technical specification, refer to the [OpenAPI YAML file](./openapi.yaml).
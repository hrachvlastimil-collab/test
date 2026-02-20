# Risk Scoring API

Minimal Node.js + Express REST API with a `POST /score` endpoint.

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

API runs on `http://localhost:3000` by default.

## Endpoint

### `POST /score`

Request body (JSON):

```json
{
  "invoiceAmount": 8500,
  "debtorCountry": "DE",
  "debtorRating": 6,
  "daysPastDueAverage": 20
}
```

Validation rules:

- `invoiceAmount`: positive number
- `debtorCountry`: string (min 2 characters)
- `debtorRating`: integer from 1 to 10
- `daysPastDueAverage`: number >= 0

Success response:

```json
{
  "riskScore": 45,
  "decision": "REVIEW"
}
```

Decision bands:

- `0-33` => `APPROVE`
- `34-66` => `REVIEW`
- `67-100` => `REJECT`

Validation error response (`400`):

```json
{
  "error": "Validation failed",
  "details": [
    "invoiceAmount must be a positive number"
  ]
}
```

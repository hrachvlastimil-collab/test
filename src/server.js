const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateBody(body) {
  const errors = [];
  const { invoiceAmount, debtorCountry, debtorRating, daysPastDueAverage } = body;

  if (!isNumber(invoiceAmount) || invoiceAmount <= 0) {
    errors.push('invoiceAmount must be a positive number');
  }

  if (typeof debtorCountry !== 'string' || debtorCountry.trim().length < 2) {
    errors.push('debtorCountry must be a string with at least 2 characters');
  }

  if (!Number.isInteger(debtorRating) || debtorRating < 1 || debtorRating > 10) {
    errors.push('debtorRating must be an integer between 1 and 10');
  }

  if (!isNumber(daysPastDueAverage) || daysPastDueAverage < 0) {
    errors.push('daysPastDueAverage must be a number greater than or equal to 0');
  }

  return errors;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateRiskScore({ invoiceAmount, debtorRating, daysPastDueAverage }) {
  const amountRisk = clamp((invoiceAmount / 10000) * 35, 0, 35);
  const ratingRisk = clamp(((10 - debtorRating) / 9) * 35, 0, 35);
  const delayRisk = clamp((daysPastDueAverage / 90) * 30, 0, 30);

  return Math.round(amountRisk + ratingRisk + delayRisk);
}

function decide(score) {
  if (score <= 33) return 'APPROVE';
  if (score <= 66) return 'REVIEW';
  return 'REJECT';
}

app.post('/score', (req, res) => {
  const errors = validateBody(req.body || {});

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
    });
  }

  const riskScore = calculateRiskScore(req.body);
  const decision = decide(riskScore);

  return res.json({ riskScore, decision });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Risk API listening on port ${port}`);
});

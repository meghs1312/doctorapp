const express = require('express');
const router = express.Router();

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh',
];

const SPECIALITIES = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician',
  'Orthopedic', 'Gynecologist', 'Neurologist', 'Psychiatrist',
  'ENT Specialist', 'Ophthalmologist',
];

router.get('/cities', (req, res) => {
  res.json({ cities: CITIES });
});

router.get('/specialities', (req, res) => {
  res.json({ specialities: SPECIALITIES });
});

module.exports = router;

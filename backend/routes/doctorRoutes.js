const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/doctors', doctorController.fetchDoctorsWithFilters);
router.post('/doctors', doctorController.createDoctor);
router.get('/doctors/top', doctorController.fetchTopSearchedDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);

module.exports = router;

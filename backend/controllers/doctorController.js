const doctorModel = require('../models/doctorModel');

const fetchDoctors = (req, res) => {
  doctorModel.getAllDoctors((err, doctors) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch doctors' });
    }

    res.status(200).json(doctors);
  });
};

const createDoctor = (req, res) => {
  // reads JSON sent by client
  const doctorData = req.body;

  doctorModel.createDoctor(doctorData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to create doctor' });
    }

    res.status(201).json({
      // 201 = resource created
      message: 'Doctor created successfully',
      doctorId: result.insertId,
    });
  });
};

const getDoctorById = (req, res) => {
  const doctorId = req.params.id;

  doctorModel.getDoctorById(doctorId, (err, doctor) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch doctor' });
    }

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  });
};
const fetchDoctorsWithFilters = (req, res) => {
  const filters = {
    search: req.query.search,
    city: req.query.city,
    speciality: req.query.speciality,
    page: req.query.page,
    limit: req.query.limit,
  };

  doctorModel.getDoctorsWithFilters(filters, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch doctors' });
    }

    res.status(200).json(result);
  });
};
const fetchTopSearchedDoctors = (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 4;

  doctorModel.getTopSearchedDoctors(limit, (err, doctors) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch top searched doctors' });
    }

    res.status(200).json(doctors);
  });
};



module.exports = {
  fetchDoctors,
  createDoctor,
  getDoctorById,
  fetchDoctorsWithFilters,
  fetchTopSearchedDoctors,
};

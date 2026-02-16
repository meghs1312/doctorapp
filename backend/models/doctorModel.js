const db = require('../config/db');

// GET all doctors
const getAllDoctors = (callback) => {
  const query = 'SELECT * FROM doctors';

  db.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// CREATE a doctor
const createDoctor = (doctorData, callback) => {
  const query = `
    INSERT INTO doctors
    (name, gender, age, email, phone, city, institute_name, degree_name, speciality, yoe, consultation_fee, profile_picture)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    doctorData.name,
    doctorData.gender,
    doctorData.age,
    doctorData.email,
    doctorData.phone,
    doctorData.city,
    doctorData.institute_name,
    doctorData.degree_name,
    doctorData.speciality,
    doctorData.yoe,
    doctorData.consultation_fee,
    doctorData.profile_picture,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

const getDoctorById = (doctorId, callback) => {
  const updateQuery = `
    UPDATE doctors
    SET search_count = search_count +1
    WHERE id = ?
  `;

  const selectQuery = `
    SELECT * FROM doctors
    WHERE id = ?
  `;

  db.query(updateQuery, [doctorId], (updateErr) => {
    if (updateErr) {
      return callback(updateErr, null);
    }

    db.query(selectQuery, [doctorId], (selectErr, results) => {
      if (selectErr) {
        return callback(selectErr, null);
      }

      callback(null, results[0]);
    });
  });
};
const getDoctorsWithFilters = (filters, callback) => {
  let whereClause = 'WHERE 1=1';
  const values = [];

  if (filters.search) {
    whereClause += ' AND name LIKE ?';
    values.push(`%${filters.search}%`);
  }

  if (filters.cities && filters.cities.length > 0) {
    const placeholders = filters.cities.map(() => '?').join(',');
    whereClause += ` AND city IN (${placeholders})`;
    values.push(...filters.cities);
  }

  if (filters.specialities && filters.specialities.length > 0) {
    const placeholders = filters.specialities.map(() => '?').join(',');
    whereClause += ` AND speciality IN (${placeholders})`;
    values.push(...filters.specialities);
  }

  const limit = parseInt(filters.limit) || 10;
  const page = parseInt(filters.page) || 1;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) as total FROM doctors ${whereClause}`;
  db.query(countQuery, values, (countErr, countResult) => {
    if (countErr) {
      return callback(countErr, null);
    }
    const total = countResult[0].total;
    const selectQuery = `SELECT * FROM doctors ${whereClause} ORDER BY id ASC LIMIT ? OFFSET ?`;
    db.query(selectQuery, [...values, limit, offset], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, {
        doctors: results,
        total,
        page,
        limit,
        hasMore: offset + results.length < total,
      });
    });
  });
};
const getTopSearchedDoctors = (limit, callback) => {
  const query = `
    SELECT *
    FROM doctors
    ORDER BY search_count DESC
    LIMIT ?
  `;

  db.query(query, [limit], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};


module.exports = {
  getAllDoctors,
  createDoctor,
  getDoctorById,
  getDoctorsWithFilters,
  getTopSearchedDoctors,
};

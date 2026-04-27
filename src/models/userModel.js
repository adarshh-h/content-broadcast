const pool = require('../config/db');

// -----------------------------------------------
// User Model
// All database queries related to users
// -----------------------------------------------

const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const create = async ({ name, email, password_hash, role }) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, password_hash, role]
  );
  return result.rows[0];
};

const getAllTeachers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE role = 'teacher'"
  );
  return result.rows;
};

module.exports = { findByEmail, findById, create, getAllTeachers };

const pool = require('../config/db');

// -----------------------------------------------
// Content Model
// All database queries related to content
// -----------------------------------------------

const create = async ({ title, description, subject, file_url, file_type, file_size, uploaded_by, start_time, end_time }) => {
  const result = await pool.query(
    `INSERT INTO content 
      (title, description, subject, file_url, file_type, file_size, uploaded_by, status, start_time, end_time) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, $9) 
     RETURNING *`,
    [title, description || null, subject, file_url, file_type, file_size, uploaded_by, start_time || null, end_time || null]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
  return result.rows[0];
};

const findAll = async () => {
  const result = await pool.query(
    `SELECT c.*, u.name as teacher_name, u.email as teacher_email
     FROM content c
     JOIN users u ON u.id = c.uploaded_by
     ORDER BY c.created_at DESC`
  );
  return result.rows;
};

const findPending = async () => {
  const result = await pool.query(
    `SELECT c.*, u.name as teacher_name, u.email as teacher_email
     FROM content c
     JOIN users u ON u.id = c.uploaded_by
     WHERE c.status = 'pending'
     ORDER BY c.created_at DESC`
  );
  return result.rows;
};

const findByTeacher = async (teacherId) => {
  const result = await pool.query(
    `SELECT c.*, cs.rotation_order, cs.duration
     FROM content c
     LEFT JOIN content_schedule cs ON cs.content_id = c.id
     WHERE c.uploaded_by = $1
     ORDER BY c.created_at DESC`,
    [teacherId]
  );
  return result.rows;
};

const updateStatus = async ({ id, status, approved_by, rejection_reason }) => {
  const result = await pool.query(
    `UPDATE content 
     SET status = $1, approved_by = $2, approved_at = NOW(), rejection_reason = $3
     WHERE id = $4
     RETURNING *`,
    [status, approved_by, rejection_reason || null, id]
  );
  return result.rows[0];
};

const findApprovedByTeacher = async (teacherId) => {
  const result = await pool.query(
    `SELECT 
       c.id, c.title, c.description, c.subject,
       c.file_url, c.file_type, c.start_time, c.end_time,
       cs.rotation_order, cs.duration
     FROM content c
     JOIN content_schedule cs ON cs.content_id = c.id
     JOIN content_slots sl ON sl.id = cs.slot_id
     WHERE c.uploaded_by = $1
       AND c.status = 'approved'
       AND c.start_time IS NOT NULL
       AND c.end_time IS NOT NULL
     ORDER BY c.subject, cs.rotation_order ASC`,
    [teacherId]
  );
  return result.rows;
};

module.exports = { create, findById, findAll, findPending, findByTeacher, updateStatus, findApprovedByTeacher };

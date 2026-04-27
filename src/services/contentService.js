const pool = require('../config/db');
const contentModel = require('../models/contentModel');

const uploadContent = async ({ title, description, subject, file, teacherId, start_time, end_time, duration }) => {
  const file_url = `/uploads/${file.filename}`;
  const file_type = file.mimetype;
  const file_size = file.size;

  const content = await contentModel.create({
    title, description, subject: subject.toLowerCase(),
    file_url, file_type, file_size,
    uploaded_by: teacherId, start_time, end_time
  });

  if (start_time && end_time) {
    const slotResult = await pool.query(
      `INSERT INTO content_slots (teacher_id, subject)
       VALUES ($1, $2)
       ON CONFLICT (teacher_id, subject) DO UPDATE SET subject = EXCLUDED.subject
       RETURNING id`,
      [teacherId, subject.toLowerCase()]
    );
    const slotId = slotResult.rows[0].id;

    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(rotation_order), 0) as max_order FROM content_schedule WHERE slot_id = $1',
      [slotId]
    );
    const nextOrder = orderResult.rows[0].max_order + 1;
    const rotationDuration = duration || 5;

    await pool.query(
      `INSERT INTO content_schedule (content_id, slot_id, rotation_order, duration) VALUES ($1, $2, $3, $4)`,
      [content.id, slotId, nextOrder, rotationDuration]
    );
  }

  const warning = (!start_time || !end_time)
    ? 'No start_time/end_time provided. Content will not be visible to students until scheduled.'
    : null;

  return { content, warning };
};

const getMyContent = async (teacherId) => {
  return await contentModel.findByTeacher(teacherId);
};

module.exports = { uploadContent, getMyContent };

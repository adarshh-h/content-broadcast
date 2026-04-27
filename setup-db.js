// ================================================
// Run this file ONCE to create all tables in Neon
// Command: node setup-db.js
// ================================================

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('principal', 'teacher')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  approved_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_slots (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(teacher_id, subject)
);

CREATE TABLE IF NOT EXISTS content_schedule (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  slot_id INTEGER NOT NULL REFERENCES content_slots(id) ON DELETE CASCADE,
  rotation_order INTEGER NOT NULL,
  duration INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_uploaded_by ON content(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_subject ON content(subject);
CREATE INDEX IF NOT EXISTS idx_content_slots_teacher ON content_slots(teacher_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slot ON content_schedule(slot_id);
`;

async function setupDatabase() {
  console.log('🔄 Connecting to Neon database...');
  
  try {
    await pool.query(schema);
    console.log('');
    console.log('✅ All tables created successfully!');
    console.log('✅ users table ready');
    console.log('✅ content table ready');
    console.log('✅ content_slots table ready');
    console.log('✅ content_schedule table ready');
    console.log('✅ All indexes created');
    console.log('');
    console.log('🎉 Database is ready! Now run: npm run dev');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// -----------------------------------------------
// Middlewares
// -----------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// -----------------------------------------------
// Routes
// -----------------------------------------------
app.use('/auth', require('./routes/authRoutes'));
app.use('/approval', require('./routes/approvalRoutes'));
app.use('/content', require('./routes/contentRoutes'));
app.use('/content', require('./routes/broadcastRoutes'));

// -----------------------------------------------
// Health check
// -----------------------------------------------
app.get('/', (req, res) => {
  res.json({ message: '✅ Content Broadcasting System is running!' });
});

// -----------------------------------------------
// 404 Handler
// -----------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// -----------------------------------------------
// Global Error Handler
// -----------------------------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max size is 10MB.' });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// -----------------------------------------------
// Start Server
// -----------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;

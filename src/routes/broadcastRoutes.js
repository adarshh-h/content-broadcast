const express = require('express');
const router = express.Router();
const broadcastController = require('../controllers/broadcastController');

// GET /content/live/:teacherId - Public route for students
// No authentication required
router.get('/live/:teacherId', broadcastController.getLiveContent);

module.exports = router;

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isTeacher } = require('../middlewares/roleMiddleware');
const upload = require('../utils/fileUpload');

// POST /content/upload - Teacher uploads content
router.post(
  '/upload',
  authMiddleware,
  isTeacher,
  upload.single('file'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
  ],
  contentController.uploadContent
);

// GET /content/my - Teacher views own content
router.get(
  '/my',
  authMiddleware,
  isTeacher,
  contentController.getMyContent
);

module.exports = router;

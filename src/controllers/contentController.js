const { validationResult } = require('express-validator');
const contentService = require('../services/contentService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// -----------------------------------------------
// POST /content/upload  (Teacher only)
// -----------------------------------------------
const uploadContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    if (!req.file) {
      return errorResponse(res, 400, 'File is required. Allowed types: JPG, PNG, GIF');
    }

    const { title, description, subject, start_time, end_time, duration } = req.body;

    const result = await contentService.uploadContent({
      title,
      description,
      subject,
      file: req.file,
      teacherId: req.user.id,
      start_time,
      end_time,
      duration: duration ? parseInt(duration) : null,
    });

    return successResponse(res, 201, 'Content uploaded successfully', {
      content: result.content,
      warning: result.warning,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// -----------------------------------------------
// GET /content/my  (Teacher only)
// -----------------------------------------------
const getMyContent = async (req, res) => {
  try {
    // Safety check
    if (!req.user || !req.user.id) {
      return errorResponse(res, 401, 'Unauthorized - user not found');
    }

    const content = await contentService.getMyContent(req.user.id);
    return successResponse(res, 200, 'Content fetched successfully', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { uploadContent, getMyContent };

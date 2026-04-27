const schedulingService = require('../services/schedulingService');
const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// -----------------------------------------------
// GET /content/live/:teacherId
// PUBLIC - No authentication required
// Students use this to see active content
// -----------------------------------------------
const getLiveContent = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Check teacher exists
    const teacher = await pool.query(
      "SELECT id, name FROM users WHERE id = $1 AND role = 'teacher'",
      [teacherId]
    );

    // If teacher not found → return no content (not an error per assignment)
    if (teacher.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No content available',
        data: [],
      });
    }

    // Get active content using scheduling logic
    const activeContent = await schedulingService.getLiveContent(teacherId);

    if (!activeContent || activeContent.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No content available',
        data: [],
      });
    }

    return successResponse(res, 200, 'Live content fetched successfully', {
      teacher: teacher.rows[0].name,
      active_content: activeContent,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { getLiveContent };

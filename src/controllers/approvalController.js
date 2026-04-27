const approvalService = require('../services/approvalService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// GET /approval/all
const getAllContent = async (req, res) => {
  try {
    const content = await approvalService.getAllContent();
    return successResponse(res, 200, 'All content fetched', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// GET /approval/pending
const getPendingContent = async (req, res) => {
  try {
    const content = await approvalService.getPendingContent();
    return successResponse(res, 200, 'Pending content fetched', content);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// PATCH /approval/:id/approve
const approveContent = async (req, res) => {
  try {
    const content = await approvalService.approveContent(req.params.id, req.user.id);
    return successResponse(res, 200, 'Content approved successfully', content);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

// PATCH /approval/:id/reject
const rejectContent = async (req, res) => {
  try {
    const { rejection_reason } = req.body;
    const content = await approvalService.rejectContent(req.params.id, req.user.id, rejection_reason);
    return successResponse(res, 200, 'Content rejected', content);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

module.exports = { getAllContent, getPendingContent, approveContent, rejectContent };

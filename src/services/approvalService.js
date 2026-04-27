const contentModel = require('../models/contentModel');

const getAllContent = async () => {
  return await contentModel.findAll();
};

const getPendingContent = async () => {
  return await contentModel.findPending();
};

// -----------------------------------------------
// Approve content - ONLY if status is pending
// -----------------------------------------------
const approveContent = async (contentId, principalId) => {
  const content = await contentModel.findById(contentId);

  if (!content) {
    throw new Error('Content not found.');
  }

  // Only pending content can be approved
  if (content.status === 'approved') {
    throw new Error('Content is already approved. Cannot approve again.');
  }

  if (content.status === 'rejected') {
    throw new Error('Content is already rejected. Cannot approve a rejected content.');
  }

  return await contentModel.updateStatus({
    id: contentId,
    status: 'approved',
    approved_by: principalId,
    rejection_reason: null
  });
};

// -----------------------------------------------
// Reject content - ONLY if status is pending
// -----------------------------------------------
const rejectContent = async (contentId, principalId, rejection_reason) => {
  const content = await contentModel.findById(contentId);

  if (!content) {
    throw new Error('Content not found.');
  }

  // Only pending content can be rejected
  if (content.status === 'rejected') {
    throw new Error('Content is already rejected. Cannot reject again.');
  }

  if (content.status === 'approved') {
    throw new Error('Content is already approved. Cannot reject an approved content.');
  }

  if (!rejection_reason || rejection_reason.trim() === '') {
    throw new Error('Rejection reason is required.');
  }

  return await contentModel.updateStatus({
    id: contentId,
    status: 'rejected',
    approved_by: principalId,
    rejection_reason
  });
};

module.exports = { getAllContent, getPendingContent, approveContent, rejectContent };

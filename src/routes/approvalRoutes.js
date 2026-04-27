const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const authMiddleware = require('../middlewares/authMiddleware');
const { isPrincipal } = require('../middlewares/roleMiddleware');

// All approval routes require JWT + principal role
router.use(authMiddleware, isPrincipal);

// GET /approval/all - Principal views all content
router.get('/all', approvalController.getAllContent);

// GET /approval/pending - Principal views pending content
router.get('/pending', approvalController.getPendingContent);

// PATCH /approval/:id/approve - Principal approves content
router.patch('/:id/approve', approvalController.approveContent);

// PATCH /approval/:id/reject - Principal rejects content
router.patch('/:id/reject', approvalController.rejectContent);

module.exports = router;

const express = require('express');
const {
  createBloodRequestForSelf,
  createBloodRequestForOthers,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
  getRequestsCount
} = require('../controllers/requestController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBloodRequestForSelf);
router.post('/for-others', protect, createBloodRequestForOthers);
router.get('/', getAllRequests);
router.get('/count', protect, adminOnly, getRequestsCount);
router.put('/:id/status', protect, adminOnly, updateRequestStatus);
router.delete('/:id', protect, adminOnly, deleteRequest);

module.exports = router;

const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserCount,
  getDonationCount,
  getRequestCount,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/users/count', protect, adminOnly, getUserCount);
router.get('/donations/count', protect, adminOnly, getDonationCount);
router.get('/requests/count', protect, adminOnly, getRequestCount);

router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;

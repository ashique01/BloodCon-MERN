const express = require('express');
const { addDonation, getMyDonations, getAllDonations, deleteDonation, getDonorDonations, getDonationsCount } = require('../controllers/donationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addDonation);
router.get('/my', protect, getMyDonations);
router.get('/', protect, adminOnly, getAllDonations);
router.get('/donor/:id', protect, getDonorDonations);
router.delete('/:id', protect, adminOnly, deleteDonation);

router.get('/count', protect, adminOnly, getDonationsCount);

module.exports = router;


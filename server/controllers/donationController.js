const DonationHistory = require('../models/DonationHistory');
const User = require('../models/User');

// @desc    Add donation record
// @route   POST /api/donations
// @access  Protected
exports.addDonation = async (req, res) => {
  const { donationDate, bloodGroup, location, recipientName, notes } = req.body;

  try {
    const donation = await DonationHistory.create({
      donor: req.user._id,
      donationDate,
      bloodGroup,
      location,
      recipientName,
      notes,
    });

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all donation records of logged-in user
// @route   GET /api/donations/my
// @access  Protected
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await DonationHistory.find({ donor: req.user._id }).sort({ donationDate: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all donation records (Admin only)
// @route   GET /api/donations
// @access  Admin
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await DonationHistory.find().populate('donor', 'name email bloodGroup').sort({ donationDate: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a donation record (Admin only)
// @route   DELETE /api/donations/:id
// @access  Admin
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await DonationHistory.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    await donation.deleteOne();
    res.json({ message: 'Donation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getDonorDonations = async (req, res) => {
  try {
    const donorId = req.params.id;
   
    const donations = await DonationHistory.find({ donor: donorId })
      .sort({ donationDate: -1 }); // Sort by most recent first

    if (!donations) {
     
      return res.status(404).json({ message: 'Donations not found for this donor.' });
    }

    res.json(donations);
  } catch (error) {
    console.error("Error fetching donor's donations in backend:", error); 
    res.status(500).json({ message: 'Server error while fetching donor donations.' });
  }
};

// @desc    Get count of all donations
// @route   GET /api/donations/count
// @access  Admin (or Protected if you want)
exports.getDonationsCount = async (req, res) => {
  try {
    const count = await DonationHistory.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error getting donations count:", err);
    res.status(500).json({ message: "Server error fetching donations count" });
  }
};
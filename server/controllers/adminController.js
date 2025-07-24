const User = require('../models/User');
const Donation = require('../models/DonationHistory');
const Request = require('../models/BloodRequest');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin Only
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Admin Only
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user (e.g., make admin)
// @route   PUT /api/admin/users/:id
// @access  Admin Only
exports.updateUser = async (req, res) => {
  try {
    const { name, email, isAdmin, availableToDonate } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
    user.availableToDonate = availableToDonate !== undefined ? availableToDonate : user.availableToDonate;

    await user.save();
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin Only
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get total number of users
// @route   GET /api/admin/users/count
// @access  Admin Only
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user count' });
  }
};

// @desc    Get total donation count
// @route   GET /api/admin/donations/count
// @access  Admin Only
exports.getDonationCount = async (req, res) => {
  try {
    const { status } = req.query;
    const count = status
      ? await Donation.countDocuments({ status })
      : await Donation.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get total request count or filter by status
// @route   GET /api/admin/requests/count?status=Pending
// @access  Admin Only
exports.getRequestCount = async (req, res) => {
  try {
    const { status } = req.query;
    const count = status
      ? await Request.countDocuments({ status })
      : await Request.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

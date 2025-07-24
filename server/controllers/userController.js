const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, phone, bloodGroup, dob, city, address } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodGroup,
      dob,
      city,
      address,
      availableToDonate: true,
    });

    if (!user)
      return res.status(400).json({ message: "Invalid user data" });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      ...userObj,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      ...userObj,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const updatableFields = [
      "name",
      "email",
      "phone",
      "bloodGroup",
      "dob",
      "city",
      "address",
      "availableToDonate",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json({
      ...userObj,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error during profile update" });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error during password change" });
  }
};

// @desc    Get all donors with optional availability filter and pagination
// @route   GET /api/users/all-donors
// @access  Private
exports.getAllDonors = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.min(100, parseInt(req.query.limit)) || 10; // Limit max 100 for safety
    const skip = (page - 1) * limit;

    const query = { isAdmin: false };
    if (req.query.availableToDonate === "true") {
      query.availableToDonate = true;
    }

    const totalDonors = await User.countDocuments(query);
    const donors = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    res.json({
      donors,
      currentPage: page,
      totalPages: Math.ceil(totalDonors / limit),
      totalDonors,
    });
  } catch (err) {
    console.error("Error fetching all donors:", err);
    res.status(500).json({ message: "Server error while fetching donors." });
  }
};

// @desc    Get donor by ID with limited sensitive info
// @route   GET /api/users/:id
// @access  Private
exports.getDonorById = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id).select("-password");
    if (!donor || donor.isAdmin)
      return res.status(404).json({ message: "Donor not found" });

    const isOwner = req.user._id.toString() === donor._id.toString();
    const isAdmin = req.user.isAdmin;

    const responseData = {
      _id: donor._id,
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      dob: donor.dob,
      city: donor.city,
      address: donor.address,
      availableToDonate: donor.availableToDonate,
    };

    // Reveal email and phone only if requester is admin or the donor themselves
    if (isAdmin || isOwner) {
      responseData.email = donor.email;
      responseData.phone = donor.phone;
    }

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching donor by ID:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid donor ID" });
    }
    res.status(500).json({ message: "Server error while fetching donor details." });
  }
};

// @desc    Get count of users (with filters)
// @route   GET /api/users/count?available=true|false&admin=true&newMonth=true
// @access  Private/Admin
exports.getUsersCount = async (req, res) => {
  try {
    const query = {};

    if (req.query.available === "true") {
      query.availableToDonate = true;
    } else if (req.query.available === "false") {
      query.availableToDonate = false;
    }

    if (req.query.admin === "true") {
      query.isAdmin = true;
    } else if (req.query.admin === "false") {
      query.isAdmin = false;
    }

    if (req.query.newMonth === "true") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      query.registeredAt = { $gte: startOfMonth };
    }

    const count = await User.countDocuments(query);
    res.json({ count });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).json({ message: "Server error fetching user count" });
  }
};

// @desc    Get top cities by user count
// @route   GET /api/users/top-cities
// @access  Private/Admin
exports.getTopCities = async (req, res) => {
  try {
    const cities = await User.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { name: "$_id", count: 1, _id: 0 } },
    ]);

    res.json({ cities });
  } catch (error) {
    console.error("Error getting top cities:", error);
    res.status(500).json({ message: "Server error fetching top cities" });
  }
};

// @desc    Get the most common blood group among users
// @route   GET /api/users/common-bloodgroup
// @access  Private/Admin
exports.getCommonBloodGroup = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const bloodGroup = result.length > 0 ? result[0]._id : null;

    res.json({ bloodGroup });
  } catch (error) {
    console.error("Error getting common blood group:", error);
    res.status(500).json({ message: "Server error fetching common blood group" });
  }
};


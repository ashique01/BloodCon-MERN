const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllDonors,
  changePassword,
  getDonorById,
  getUsersCount,
  getTopCities,
  getCommonBloodGroup,
} = require("../controllers/userController");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/all-donors", protect, getAllDonors);
router.get("/count", protect, adminOnly, getUsersCount);  
router.get("/top-cities", protect, adminOnly, getTopCities); 
router.get("/common-bloodgroup", protect, adminOnly, getCommonBloodGroup);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

router.get("/:id", protect, getDonorById);            

module.exports = router;

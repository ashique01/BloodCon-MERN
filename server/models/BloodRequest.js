const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String,required: false },
  bloodGroupNeeded: { type: String, required: true },
  city: { type: String, required: true },
  hospitalName: { type: String },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Accepted', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String },
  city: { type: String, required: true },
  lastDonationDate: { type: Date },
  availableToDonate: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

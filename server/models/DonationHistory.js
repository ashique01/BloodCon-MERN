const mongoose = require('mongoose');

const donationHistorySchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donationDate: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  location: { type: String, required: true },
  recipientName: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DonationHistory', donationHistorySchema);

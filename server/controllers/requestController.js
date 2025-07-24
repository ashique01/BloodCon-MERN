const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

exports.createBloodRequestForSelf = async (req, res) => {
  try {
    const { bloodGroupNeeded, city, hospitalName, message } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized, user not found.' });
    }

    const loggedInUser = await User.findById(req.user._id).select('name phone email');

    if (!loggedInUser) {
      return res.status(404).json({ message: 'Logged-in user profile not found.' });
    }

    const newRequest = await BloodRequest.create({
      requesterName: loggedInUser.name,
      email: loggedInUser.email,
      phone: loggedInUser.phone,
      bloodGroupNeeded,
      city,
      hospitalName: hospitalName || '',
      message: message || '',
      status: 'Pending',
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating blood request:", error);
    res.status(500).json({ message: 'Server error creating blood request' });
  }
};



exports.createBloodRequestForOthers = async (req, res) => {
  const {
    recipientName,
    recipientBloodGroup,
    location,
    hospitalName,
    contactPerson,
    contactPhone,
    contactEmail,   // added contactEmail here
    notes
  } = req.body;

  const finalRequesterName = contactPerson || recipientName;
  const finalPhone = contactPhone;

  if (!finalRequesterName || !finalPhone || !recipientBloodGroup || !location || !hospitalName) {
    return res.status(400).json({ message: 'Please fill all required fields for the blood request for others.' });
  }

  try {
    const newRequest = await BloodRequest.create({
      requesterName: finalRequesterName,
      phone: finalPhone,
      email: contactEmail || '',    // added email here
      bloodGroupNeeded: recipientBloodGroup,
      city: location,
      hospitalName,
      message: notes || '',
      status: 'Pending',
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error creating blood request for someone else:", err);
    res.status(500).json({ message: err.message || 'Server error while creating blood request for someone else.' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Error fetching all blood requests:", err);
    res.status(500).json({ message: err.message || 'Server error while fetching blood requests.' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['Pending', 'Accepted', 'Completed'];

  try {
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing status provided.' });
    }

    const request = await BloodRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found.' });
    }

    request.status = status;
    request.updatedAt = Date.now();

    await request.save();

    return res.json({ message: 'Request status updated successfully.', request });
  } catch (err) {
    console.error('Error updating blood request status:', err);
    return res.status(500).json({ message: 'Server error while updating blood request status.' });
  }
};


exports.deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await BloodRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.deleteOne();
    res.json({ message: 'Blood request deleted successfully.' });
  } catch (err) {
    console.error("Error deleting blood request:", err);
    res.status(500).json({ message: err.message || 'Server error while deleting blood request.' });
  }
};

// @desc    Get count of all blood requests
// @route   GET /api/requests/count
// @access  Admin or Protected as needed
exports.getRequestsCount = async (req, res) => {
  try {
    const count = await BloodRequest.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error getting blood requests count:", err);
    res.status(500).json({ message: "Server error fetching blood requests count" });
  }
};
